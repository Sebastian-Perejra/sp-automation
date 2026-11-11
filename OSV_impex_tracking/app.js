/* OSV IMPEX Tracking — browser demo + Google Apps Script client, no external dependencies. */
(() => {
  'use strict';
  const DAY_MS = 86400000;
  const STORAGE_KEY = 'osv-impex-demo-v1';
  const SESSION_KEY = 'osv-impex-session';
  const IS_GAS = !!(window.google && google.script && google.script.run);
  const TODAY = iso(new Date());
  const STATUS = [
    {id:'received', label:'Задание получено', short:'Получено', stage:'intake', allowed:'actual'},
    {id:'search_transport', label:'Поиск транспорта', short:'Поиск ТС', stage:'transport', allowed:'actual'},
    {id:'transport_booked', label:'Транспорт согласован', short:'ТС найден', stage:'transport', allowed:'actual'},
    {id:'vehicle_eta', label:'Ожидаемая подача транспорта', short:'Подача ТС', stage:'transport', allowed:'planned'},
    {id:'loading_actual', label:'Транспорт подан под загрузку', short:'ТС подан', stage:'transport', allowed:'actual'},
    {id:'pickup_actual', label:'Груз забран / отправлен', short:'Забран', stage:'transport', allowed:'actual'},
    {id:'customs_eta', label:'Ожидаемое прибытие на таможню', short:'ETA там.', stage:'customs', allowed:'planned'},
    {id:'customs_arrived', label:'Прибыл на таможенное оформление', short:'На тамож.', stage:'customs', allowed:'actual'},
    {id:'customs_cleared', label:'Таможенное оформление завершено', short:'Оформлен', stage:'customs', allowed:'actual'},
    {id:'delivery_eta', label:'Ожидаемая дата доставки / выгрузки', short:'ETA дост.', stage:'delivery', allowed:'planned'},
    {id:'delivered', label:'Груз доставлен / выгружен', short:'Доставлен', stage:'done', allowed:'actual'},
    {id:'hold', label:'Приостановлено / задержка', short:'Задержка', stage:'transport', allowed:'actual'}
  ];
  const BY_STATUS = Object.fromEntries(STATUS.map(s => [s.id,s]));
  const state = {
    view:'timeline', operations:[], events:[], audit:[], query:'', direction:'all', filter:'all',
    start:'2026-10-01', end: addDays(TODAY,95), token:null, isLoading:false,
    activeOperation:null, activeDate:null, initialized:false
  };
  const $ = id => document.getElementById(id);
  function iso(date) { const d = date instanceof Date ? date : new Date(date); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-'); }
  function asDate(s) { return new Date(String(s).slice(0,10)+'T12:00:00'); }
  function addDays(s,n){const d=asDate(s);d.setDate(d.getDate()+n);return iso(d);}
  function dayDiff(a,b){return Math.round((asDate(b)-asDate(a))/DAY_MS);}
  function formatDate(s,opts){return asDate(s).toLocaleDateString('ru-RU',opts||{day:'numeric',month:'short',year:'numeric'});}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function uid(){return (crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2);}
  function statusFor(s){return BY_STATUS[s]||{label:s,short:s,stage:'intake',allowed:'actual'};}
  function operationEvents(id){return state.events.filter(e=>e.operationId===id).sort((a,b)=>a.date.localeCompare(b.date)||(a.createdAt||'').localeCompare(b.createdAt||''));}
  function delivered(op){return operationEvents(op.id).some(e=>e.status==='delivered'&&e.type==='actual');}
  function phaseOf(op,date){const actual=operationEvents(op.id).filter(e=>e.type==='actual'&&e.date<=date);if(!actual.some(e=>e.status==='received'))return '';const last=actual[actual.length-1];if(last?.status==='delivered')return last.date===date?'done':'';return statusFor(last.status).stage;}
  function correctOverdue(op){
    const ev=operationEvents(op.id), pairs={vehicle_eta:['loading_actual','pickup_actual'],customs_eta:['customs_arrived'],delivery_eta:['delivered']};
    return ev.some(p=>{
      if(p.type!=='planned'||!pairs[p.status])return false;
      const done=ev.find(a=>a.type==='actual'&&pairs[p.status].includes(a.status));
      return (done ? done.date>p.date : p.date<TODAY);
    });
  }
  function opState(op){return delivered(op)?'completed':correctOverdue(op)?'overdue':'active';}
  function cycleDays(op){const es=operationEvents(op.id);const first=es.find(e=>e.status==='received'&&e.type==='actual');const last=es.find(e=>e.status==='delivered'&&e.type==='actual');return first&&last?Math.max(0,dayDiff(first.date,last.date)):null;}
  function avg(numbers){return numbers.length?numbers.reduce((s,n)=>s+n,0)/numbers.length:null;}
  function fmtMetric(v){return v===null?'—':Number.isInteger(v)?String(v):v.toFixed(1).replace('.',',');}
  function normalized(raw){return {operations:(raw.operations||[]).map(o=>({...o,id:String(o.id),archived:o.archived===true||o.archived==='true',createdAt:String(o.createdAt||'').slice(0,10)})),events:(raw.events||[]).map(e=>({...e,id:String(e.id),operationId:String(e.operationId),date:String(e.date).slice(0,10)})),audit:(raw.audit||[]).map(a=>({...a}))};}

  const demo = {
    operations:[
      {id:'s1',direction:'IMP',company:'Альфа Трейд',goods:'Промышленное оборудование',createdAt:'2026-11-02',note:'Поставка оборудования, 2 палеты',archived:false},
      {id:'s2',direction:'EXP',company:'Бета Пласт',goods:'Полимерные материалы',createdAt:'2026-11-04',note:'Экспорт в ЕС',archived:false},
      {id:'s3',direction:'IMP',company:'Вектор Логистик',goods:'Запасные части',createdAt:'2026-11-06',note:'Требуется подтверждение CMR',archived:false},
      {id:'s4',direction:'IMP',company:'Гамма Групп',goods:'Электрокомпоненты',createdAt:'2026-11-03',note:'',archived:false},
      {id:'s5',direction:'EXP',company:'Орион Хим',goods:'Связующие материалы',createdAt:'2026-11-08',note:'',archived:false},
      {id:'s6',direction:'IMP',company:'Техносфера',goods:'Производственные линии',createdAt:'2026-11-09',note:'Ожидание документации',archived:false},
      {id:'s7',direction:'EXP',company:'Дельта Экспорт',goods:'Комплектующие',createdAt:'2026-11-01',note:'Доставка подтверждена',archived:false},
      {id:'s8',direction:'IMP',company:'Сигма Индастри',goods:'Промышленная химия',createdAt:'2026-11-05',note:'',archived:false}
    ], events:[], audit:[]
  };
  const seedEvents = [
    ['s1','11-02','received','actual'],['s1','11-03','search_transport','actual'],['s1','11-06','transport_booked','actual'],['s1','11-09','vehicle_eta','planned'],['s1','11-09','loading_actual','actual'],['s1','11-10','pickup_actual','actual'],['s1','11-12','customs_eta','planned'],['s1','11-14','delivery_eta','planned'],
    ['s2','11-04','received','actual'],['s2','11-05','search_transport','actual'],['s2','11-08','vehicle_eta','planned'],['s2','11-09','loading_actual','actual'],['s2','11-09','pickup_actual','actual'],['s2','11-12','customs_eta','planned'],['s2','11-14','delivery_eta','planned'],
    ['s3','11-06','received','actual'],['s3','11-07','search_transport','actual'],['s3','11-10','vehicle_eta','planned'],['s3','11-11','loading_actual','actual'],['s3','11-11','pickup_actual','actual'],['s3','11-15','customs_eta','planned'],['s3','11-16','delivery_eta','planned'],
    ['s4','11-03','received','actual'],['s4','11-05','pickup_actual','actual'],['s4','11-07','customs_arrived','actual'],['s4','11-08','customs_cleared','actual'],['s4','11-10','delivered','actual'],
    ['s5','11-08','received','actual'],['s5','11-09','search_transport','actual'],['s5','11-13','vehicle_eta','planned'],['s5','11-16','customs_eta','planned'],
    ['s6','11-09','received','actual'],['s6','11-10','hold','actual'],['s6','11-13','vehicle_eta','planned'],
    ['s7','11-01','received','actual'],['s7','11-02','pickup_actual','actual'],['s7','11-05','customs_arrived','actual'],['s7','11-06','customs_cleared','actual'],['s7','11-08','delivered','actual'],
    ['s8','11-05','received','actual'],['s8','11-06','pickup_actual','actual'],['s8','11-08','customs_eta','planned'],['s8','11-10','customs_arrived','actual'],['s8','11-11','customs_cleared','actual'],['s8','11-13','delivery_eta','planned']
  ];
  demo.events=seedEvents.map(([operationId,dm,status,type],i)=>({id:'e'+(i+1),operationId,date:'2026-'+dm,status,type,note:'',createdAt:'2026-11-11T08:00:00.000Z'}));
  // Add illustrative history of two events on the same date.
  demo.events.push({id:'e100',operationId:'s3',date:'2026-11-11',status:'transport_booked',type:'actual',note:'Подтверждено перевозчиком',createdAt:'2026-11-11T07:00:00.000Z'});

  function loadDemo(){try{const current=JSON.parse(localStorage.getItem(STORAGE_KEY));return normalized(current&&Array.isArray(current.operations)?current:demo);}catch{return normalized(demo);}}
  function saveDemo(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({operations:state.operations,events:state.events,audit:state.audit}));}catch{console.warn('Browser storage is disabled; this demo session cannot persist after reload.');}}
  function gasCall(fn,...args){return new Promise((resolve,reject)=>{google.script.run.withSuccessHandler(resolve).withFailureHandler(e=>reject(Error(e?.message||String(e))))[fn](...args);});}
  async function backendCall(fn,...args){
    if(IS_GAS) return gasCall(fn,state.token,...args);
    let result; const actionTime=new Date().toISOString();const before=fn==='apiSaveEvent'?state.events.find(e=>e.id===args[1]?.id):null;
    if(fn==='apiCreateOperation'){
      const p=args[0]; const op={id:uid(),direction:p.direction,company:p.company,goods:p.goods,createdAt:p.date,note:p.note||'',archived:false};
      state.operations.unshift(op);state.events.push({id:uid(),operationId:op.id,date:p.date,status:'received',type:'actual',note:'',createdAt:new Date().toISOString()});result=op.id;
    }else if(fn==='apiSaveEvent'){
      const [operationId,p]=args;if(!state.operations.some(o=>o.id===operationId))throw Error('Операция не найдена');
      if(p.id){const i=state.events.findIndex(e=>e.id===p.id&&e.operationId===operationId);if(i<0)throw Error('Событие не найдено');state.events[i]={...state.events[i],date:p.date,status:p.status,type:p.type,note:p.note||''};result=p.id;}
      else{const e={...p,id:uid(),operationId,createdAt:new Date().toISOString()};state.events.push(e);result=e.id;}
    }else if(fn==='apiDeleteEvent'){
      const [operationId,id]=args;const e=state.events.find(e=>e.id===id&&e.operationId===operationId);if(!e)throw Error('Событие не найдено');
      if(e.status==='received'&&e.type==='actual')throw Error('Первое событие получения задания удалить нельзя');
      state.events=state.events.filter(x=>x.id!==id);result=true;
    }else if(fn==='apiArchiveOperation'){
      const [id,archived]=args;const op=state.operations.find(o=>o.id===id);if(!op)throw Error('Операция не найдена');op.archived=!!archived;result=true;
    }
    const actionMap={apiCreateOperation:'CREATE_OPERATION',apiSaveEvent:args[1]?.id?'UPDATE_EVENT':'CREATE_EVENT',apiDeleteEvent:'DELETE_EVENT',apiArchiveOperation:'ARCHIVE_OPERATION'};
    state.audit.unshift({at:actionTime,action:actionMap[fn]||fn,operationId:fn==='apiCreateOperation'?result:args[0],eventId:fn==='apiCreateOperation'?'':fn==='apiSaveEvent'?result:args[1],beforeJSON:before?JSON.stringify(before):'',afterJSON:''});
    saveDemo();return result;
  }
  async function reloadFromBackend(){if(!IS_GAS)return;const raw=await gasCall('apiBootstrap',state.token);Object.assign(state,normalized(raw));}
  async function guarded(action,button){if(state.isLoading)return;state.isLoading=true;if(button)button.disabled=true;try{await action();if(IS_GAS)await reloadFromBackend();renderAll(true);}catch(e){toast(e.message||'Ошибка сохранения',true);}finally{state.isLoading=false;if(button)button.disabled=false;}}

  function renderMetrics(){
    const active=state.operations.filter(o=>!o.archived&&!delivered(o));
    const completed=state.operations.filter(o=>delivered(o));
    const delays=state.operations.filter(o=>!o.archived&&correctOverdue(o));
    const cycles=completed.map(cycleDays).filter(n=>n!==null);
    const cards=[
      ['Активные операции',String(active.length),'В работе прямо сейчас','↗',''],
      ['Завершено',String(completed.length),'За весь период','✓',''],
      ['Средний цикл',fmtMetric(avg(cycles)),'От задания до доставки','◷','дн.'],
      ['С отклонениями',String(delays.length),'Плановая дата не соблюдена','⚑','']
    ];
    $('metrics').innerHTML=cards.map((m,i)=>`<article class="metric-card ${i===3&&delays.length?'metric-emphasis':''}"><div class="metric-top"><span>${m[0]}</span><span class="metric-symbol">${m[3]}</span></div><div class="metric-value"><strong>${m[1]}</strong><span class="unit">${m[4]}</span></div><div class="metric-bottom">${m[2]}</div></article>`).join('');
    $('nav-active').textContent=active.length;
  }
  function filteredOperations(){return state.operations.filter(op=>{
    if(op.archived)return false;
    if(state.direction!=='all'&&op.direction!==state.direction)return false;
    if(state.filter==='completed'&&!delivered(op))return false;
    if(state.filter==='active'&&delivered(op))return false;
    if(state.filter==='overdue'&&!correctOverdue(op))return false;
    const q=state.query.trim().toLocaleLowerCase();return !q||[op.company,op.goods,op.direction,`${op.direction} ${op.company} ${op.goods}`].some(v=>String(v).toLocaleLowerCase().includes(q));
  }).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
  function dateArray(){const a=[];for(let d=state.start;d<=state.end;d=addDays(d,1)){a.push(d);if(a.length>700)break;}return a;}
  function monthParts(dates){const result=[];dates.forEach(date=>{const key=date.slice(0,7);if(result.length&&result[result.length-1].key===key)result[result.length-1].count++;else result.push({key,count:1,date});});return result;}
  /* Floating row captions: they follow horizontal scroll, never trap taps. */
  let watermarkRaf=0;
  function timelineLabelWidth(){
    return parseFloat(getComputedStyle($('timeline-scroller')).getPropertyValue('--label-width'))||205;
  }
  function positionTimelineWatermarks(){
    const scroller=$('timeline-scroller');
    if(!scroller)return;
    if(watermarkRaf)return;
    watermarkRaf=requestAnimationFrame(()=>{
      watermarkRaf=0;
      const label=timelineLabelWidth();
      const visibleLeft=Math.max(label+12,scroller.scrollLeft+12);
      $('timeline-track').style.setProperty('--mobile-label-x',visibleLeft+'px');
    });
  }
  /* Two-finger pinch scales BOTH dates and rows, keeping the viewport centered. */
  const PINCH_MIN=.63,PINCH_MAX=1.42,BASE_DAY=66,BASE_ROW=76;
  let mobileCalendarZoom=1,pinchGesture=null,pinchHintWasShown=false,pinchHintTimer=0;
  const clampMobileZoom=n=>Math.min(PINCH_MAX,Math.max(PINCH_MIN,n));
  function applyMobileCalendarZoom(zoom){
    mobileCalendarZoom=clampMobileZoom(zoom);
    if(document.body.classList.contains('mobile-calendar-mode')){
      document.body.style.setProperty('--day-width',(BASE_DAY*mobileCalendarZoom).toFixed(2)+'px');
      document.body.style.setProperty('--mobile-row-height',(BASE_ROW*mobileCalendarZoom).toFixed(2)+'px');
    }else{
      // Do not leak 66px mobile columns into the desktop timeline.
      document.body.style.removeProperty('--day-width');
      document.body.style.removeProperty('--mobile-row-height');
    }
    const level=$('calendar-zoom-level');
    if(level)level.textContent=Math.round(mobileCalendarZoom*100)+'%';
  }
  function displayPinchHint(){
    if(pinchHintWasShown||!document.body.classList.contains('mobile-calendar-mode'))return;
    pinchHintWasShown=true;
    const hint=$('calendar-pinch-hint');
    if(!hint)return;
    hint.classList.add('is-visible');
    clearTimeout(pinchHintTimer);
    pinchHintTimer=setTimeout(()=>hint.classList.remove('is-visible'),4700);
  }
  const touchDistance=e=>Math.hypot(
    e.touches[0].clientX-e.touches[1].clientX,
    e.touches[0].clientY-e.touches[1].clientY
  );
  function installTimelinePinch(){
    const scroller=$('timeline-scroller');
    scroller.addEventListener('touchstart',e=>{
      if(!document.body.classList.contains('mobile-calendar-mode')||e.touches.length!==2)return;
      const distance=touchDistance(e);
      if(distance<12)return;
      clearTimeout(pinchHintTimer);
      $('calendar-pinch-hint').classList.remove('is-visible');
      const label=timelineLabelWidth(),w=dayWidth();
      pinchGesture={
        distance,zoom:mobileCalendarZoom,
        dateAtCenter:(scroller.scrollLeft+scroller.clientWidth/2-label)/w,
        oldScrollTop:scroller.scrollTop,
        oldHeight:BASE_ROW*mobileCalendarZoom
      };
    },{passive:true});
    scroller.addEventListener('touchmove',e=>{
      if(!pinchGesture||!document.body.classList.contains('mobile-calendar-mode')||e.touches.length!==2)return;
      e.preventDefault();
      const g=pinchGesture,next=clampMobileZoom(g.zoom*touchDistance(e)/g.distance);
      if(Math.abs(next-mobileCalendarZoom)<.005)return;
      applyMobileCalendarZoom(next);
      scroller.scrollLeft=Math.max(0,timelineLabelWidth()+g.dateAtCenter*dayWidth()-scroller.clientWidth/2);
      scroller.scrollTop=Math.max(0,g.oldScrollTop*(BASE_ROW*next)/g.oldHeight);
      positionTimelineWatermarks();
    },{passive:false});
    const finish=()=>{
      if(!pinchGesture)return;
      pinchGesture=null;
      renderTimeline(true); // redraw connecting arrows using the actual zoomed column width
    };
    scroller.addEventListener('touchend',e=>{if(e.touches.length<2)finish();},{passive:true});
    scroller.addEventListener('touchcancel',finish,{passive:true});
  }

  function renderTimeline(preserve=false){
    const scroller=$('timeline-scroller');const prevX=preserve?scroller.scrollLeft:null,prevY=preserve?scroller.scrollTop:0;
    const dates=dateArray(),todayIdx=dates.indexOf(TODAY),rows=filteredOperations();$('row-count').textContent=rows.length;
    const monthHTML=monthParts(dates).map(m=>`<div class="month-cell" style="width:calc(${m.count} * var(--day-width))">${esc(formatDate(m.date,{month:'long',year:'numeric'}).toLocaleUpperCase('ru-RU'))}</div>`).join('');
    const dayHTML=dates.map(d=>{const dt=asDate(d),dow=dt.getDay(),weekend=dow===0||dow===6;return `<div class="day-head ${weekend?'weekend':''} ${d===TODAY?'today':''}" title="${esc(formatDate(d,{day:'numeric',month:'long',year:'numeric'}))}"><span>${['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'][dow]}</span><strong>${dt.getDate()}</strong><em>${esc(formatDate(d,{month:'short'}).replace('.',''))}</em></div>`;}).join('');
    let html=`<div class="calendar-months"><div class="calendar-corner">${state.start.slice(0,4)}–${state.end.slice(0,4)}<span>КАЛЕНДАРЬ</span></div>${monthHTML}</div><div class="calendar-days"><div class="calendar-corner">ОПЕРАЦИЯ <span>СТАТУС ПО ДНЯМ</span></div>${dayHTML}</div>`;
    const arrowDayWidth=dayWidth(),arrowLabelWidth=timelineLabelWidth();
    for(const op of rows){
      const es=operationEvents(op.id);const byDate={};for(const e of es)(byDate[e.date]??=[]).push(e);
      html+=`<div class="timeline-row"><div class="timeline-row-label" data-open-op="${esc(op.id)}" title="Открыть карточку операции"><span class="direction-tag ${op.direction.toLowerCase()}">${esc(op.direction)}</span><div class="op-main"><strong title="${esc(op.company)}">${esc(op.company)}</strong><small title="${esc(op.goods)}">${esc(op.goods)}</small></div><span class="op-label-right">›</span></div>`;
      // Single sweep for the dominant current actual stage, no per-cell N^2 event traversal.
      const actuals=es.filter(e=>e.type==='actual');const receivedExists=actuals.some(e=>e.status==='received');let aidx=0,lastActual=null;
      for(const d of dates){
        while(aidx<actuals.length&&actuals[aidx].date<=d){lastActual=actuals[aidx];aidx++;}
        const isWeekend=[0,6].includes(asDate(d).getDay());
        let phase='';if(lastActual&&receivedExists&&lastActual.date<=d){phase=lastActual.status==='delivered'?(lastActual.date===d?'done':''):statusFor(lastActual.status).stage;}
        const ev=byDate[d]||[];
        const actualDelivery=ev.find(e=>e.type==='actual'&&e.status==='delivered');
        const primary=actualDelivery||ev.find(e=>e.type==='actual')||ev[0];let chip='';
        if(primary){const cfg=statusFor(primary.status);chip=`<span class="event-chip ${primary.type} ${cfg.stage}" title="${esc(ev.map(e=>`${e.type==='planned'?'ПЛАН':'ФАКТ'}: ${statusFor(e.status).label}`).join(' • '))}"><small class="chip-direction">${op.direction}.</small>${esc(cfg.short)}${ev.length>1?`<span class="event-count">+${ev.length-1}</span>`:''}</span>`;}
        // Delivery is one green cell, not an entire date column. The flag is decorative.
        const deliveredFlag=actualDelivery?'<span class="delivery-flag" aria-label="Доставлено" title="Доставлено"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 2v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 3h11l-2.6 4L16 11H5z" fill="currentColor"/></svg></span>':'';
        html+=`<div class="day-slot ${phase?'phase-'+phase:''} ${isWeekend?'weekend':''} ${actualDelivery?'is-delivered':''}" data-op="${esc(op.id)}" data-date="${d}" title="${esc(formatDate(d))} · ${esc(op.company)} · двойной клик или два касания для редактирования">${chip||'<span class="slot-add">+</span>'}${deliveredFlag}</div>`;
      }
      // A separate lightweight overlay connects consecutive unique event dates.
      // No arrow is drawn where a timeline has only one event.
      const eventDayIndexes=[...new Set(es.map(e=>dates.indexOf(e.date)).filter(idx=>idx>=0))].sort((a,b)=>a-b);
      for(let k=1;k<eventDayIndexes.length;k++){
        const start=eventDayIndexes[k-1],end=eventDayIndexes[k],gap=end-start;
        const left=Math.round(arrowLabelWidth+(start+.80)*arrowDayWidth);
        const width=Math.max(10,Math.round((gap-.60)*arrowDayWidth));
        html+=`<span class="timeline-flow-arrow" aria-hidden="true" style="left:${left}px;width:${width}px"></span>`;
      }
      const rowCaption=(op.direction==='EXP'?'ЭКСПОРТ':'ИМПОРТ')+' · '+op.company+(op.goods?' · '+op.goods:'');
      html+=`<span class="mobile-operation-watermark" aria-hidden="true">${esc(rowCaption)}</span>`;
      html+='</div>';
    }
    // Keep the calendar grid visible even when there are no operations or only a few.
    // Ghost cells are decorative and must NOT receive the .day-slot click handler.
    for(let ghost=rows.length;ghost<7;ghost++){
      html+='<div class="timeline-row timeline-placeholder-row">';
      html+='<div class="timeline-row-label timeline-placeholder-label" aria-hidden="true">'+(ghost===0&&!rows.length?'<span class="timeline-placeholder-message">Нет операций<br><small>Создайте новую операцию</small></span>':'')+'</div>';
      for(const d of dates){
        const weekend=[0,6].includes(asDate(d).getDay());
        html+='<div class="timeline-ghost-cell'+(weekend?' weekend':'')+'" aria-hidden="true"></div>';
      }
      html+='</div>';
    }
    $('timeline-track').innerHTML=html;
    requestAnimationFrame(()=>{if(prevX===null){if(todayIdx>=0)scroller.scrollLeft=Math.max(0,todayIdx*dayWidth()-dayWidth()*5);}else{scroller.scrollLeft=prevX;scroller.scrollTop=prevY;}positionTimelineWatermarks();});
  }
  function dayWidth(){return parseFloat(getComputedStyle($('timeline-scroller')).getPropertyValue('--day-width'))||79;}
  function scrollToDate(d){if(state.view!=='timeline')setView('timeline');if(d<state.start){state.start=addDays(d,-30);renderTimeline();}if(d>state.end){state.end=addDays(d,70);renderTimeline();}const idx=dayDiff(state.start,d);$('timeline-scroller').scrollTo({left:Math.max(0,idx*dayWidth()-dayWidth()*5),behavior:'smooth'});}
  function shiftWeek(dir){const el=$('timeline-scroller');el.scrollBy({left:dir*dayWidth()*7,behavior:'smooth'});}
  function renderAnalytics(){
    const intervals=[
      ['Задание → забор груза','received','pickup_actual','blue'],
      ['Забор → прибытие на таможню','pickup_actual','customs_arrived','amber'],
      ['Таможенное оформление','customs_arrived','customs_cleared','violet'],
      ['Оформление → доставка','customs_cleared','delivered','']
    ].map(([label,start,end,color])=>{
      const nums=[];state.operations.forEach(op=>{const es=operationEvents(op.id).filter(e=>e.type==='actual');const a=es.find(e=>e.status===start),b=es.find(e=>e.status===end&&a&&e.date>=a.date);if(a&&b)nums.push(dayDiff(a.date,b.date));});return {label,value:avg(nums),color,count:nums.length};
    });
    const max=Math.max(1,...intervals.map(x=>x.value??0));
    $('phase-bars').innerHTML=intervals.map(x=>`<div class="bar-line"><div class="bar-caption"><span>${x.label}</span><strong>${x.value===null?'Нет данных':fmtMetric(x.value)+' дн.'}</strong></div><div class="bar-track"><div class="bar-fill ${x.color}" style="width:${x.value===null?0:Math.max(3,x.value/max*100)}%"></div></div></div>`).join('')+'<small style="color:var(--muted);font-size:10px">Пустые этапы исключены из среднего; календарные дни.</small>';
    const counts=[['Импорт','IMP','blue'],['Экспорт','EXP','amber']].map(([name,direction,color])=>({name,color,n:state.operations.filter(o=>o.direction===direction).length}));
    const total=Math.max(1,...counts.map(c=>c.n));$('direction-bars').innerHTML=counts.map(x=>`<div class="bar-line"><div class="bar-caption"><span>${x.name}</span><strong>${x.n} операций</strong></div><div class="bar-track"><div class="bar-fill ${x.color}" style="width:${x.n/total*100}%"></div></div></div>`).join('');
    const rec=[...state.operations].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,8);
    $('recent-operations').innerHTML=rec.length?rec.map(op=>`<div class="recent-item" data-open-op="${esc(op.id)}"><div><strong>${esc(op.direction)} · ${esc(op.company)}</strong><small>${esc(op.goods)}</small></div><span>${esc(formatDate(op.createdAt,{day:'numeric',month:'short'}))} ›</span></div>`).join(''):'<p>Пока нет операций.</p>';
  }
  function renderAudit(){const actions={CREATE_OPERATION:'Создана операция',CREATE_EVENT:'Добавлено событие',UPDATE_EVENT:'Изменено событие',DELETE_EVENT:'Удалено событие',ARCHIVE_OPERATION:'Изменён статус архива'};const entries=[...state.audit].sort((a,b)=>String(b.at||'').localeCompare(String(a.at||''))).slice(0,120);$('audit-list').innerHTML=entries.length?entries.map(a=>{const op=state.operations.find(o=>o.id===a.operationId);const at=a.at?new Date(a.at):null;const when=at&&!isNaN(at.getTime())?at.toLocaleString('ru-RU'):'—';return `<div class="archive-item" ${op?`data-open-op="${esc(op.id)}"`:''}><div><strong>${esc(actions[a.action]||a.action)}</strong><p>${esc(op?op.direction+' · '+op.company:'Операция '+String(a.operationId||'').slice(0,8))}</p></div><span>${esc(when)}</span></div>`;}).join(''):'<div class="empty-state">Изменений пока нет. Первое событие будет зарегистрировано после сохранения.</div>'; }
  function renderArchive(){const ops=state.operations.filter(o=>o.archived||delivered(o)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));$('archive-list').innerHTML=ops.length?ops.map(op=>`<div class="archive-item" data-open-op="${esc(op.id)}"><div><strong>${esc(op.direction)} · ${esc(op.company)}</strong><p>${esc(op.goods)} · ${esc(formatDate(op.createdAt))}</p></div><span>${cycleDays(op)!==null?cycleDays(op)+' дн.':'Архивировано'} ↗</span></div>`).join(''):'<div class="empty-state">Завершённые операции пока отсутствуют.</div>';}
  function renderAll(preserve=false){renderMetrics();renderTimeline(preserve);renderAnalytics();renderArchive();renderAudit();}
/* Mobile-only calendar viewer with native fullscreen/orientation where permitted. */
  function isMobileCalendarDevice(){
    const viewportWidth=Math.min(window.innerWidth,document.documentElement.clientWidth||window.innerWidth);
    const shortSide=Math.min(window.innerWidth,window.innerHeight)<=600;
    const touch=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches;
    return shortSide&&(touch||viewportWidth<=760);
  }
  function updateMobileCalendarFullscreen(){
    const button=$('mobile-calendar-fullscreen');
    if(!button)return;
    const active=!!document.fullscreenElement;
    button.textContent=active?'⤡ Выйти из полного экрана':'⛶ На весь экран';
    button.setAttribute('aria-pressed',String(active));
  }
  function openMobileCalendar(){
    if(!isMobileCalendarDevice()||state.view!=='timeline')return;
    document.body.classList.add('mobile-calendar-mode');
    // Rebuild after the 150px/66px mobile grid variables become active.
    // Otherwise arrows retain desktop coordinates from the initial render.
    renderTimeline(false);
    // Device orientation always belongs to the user. Both portrait and landscape work.
    updateMobileCalendarFullscreen();
    displayPinchHint();
  }
  function closeMobileCalendar(){
    document.body.classList.remove('mobile-calendar-mode');
    clearTimeout(pinchHintTimer);
    $('calendar-pinch-hint').classList.remove('is-visible');
    pinchGesture=null;
    applyMobileCalendarZoom(1);
    renderTimeline(true);
    if(document.fullscreenElement&&document.exitFullscreen){
      Promise.resolve(document.exitFullscreen()).catch(()=>{});
    }
    updateMobileCalendarFullscreen();
  }
  async function toggleMobileCalendarFullscreen(){
    if(document.fullscreenElement){
      try{await document.exitFullscreen();}catch{toast('Не удалось выйти из полноэкранного режима',true);}
      updateMobileCalendarFullscreen();
      return;
    }
    if(!document.documentElement.requestFullscreen){
      toast('Полноэкранный режим не поддерживается. Поверните телефон вручную, если нужно больше места.',true);
      return;
    }
    try{
      await document.documentElement.requestFullscreen();
    }catch{
      toast('Браузер запретил полный экран. Поверните телефон вручную.',true);
    }
    updateMobileCalendarFullscreen();
  }

  function setView(view){state.view=view;document.body.classList.toggle('timeline-mode',view==='timeline');(view==='timeline'?$('timeline-metrics-mount'):$('global-metrics-mount')).appendChild($('metrics'));(view==='timeline'?$('timeline-actions-mount'):$('intro-actions-mount')).appendChild($('new-operation-btn'));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));document.querySelectorAll('.view-pane').forEach(p=>p.classList.add('hidden'));$(view+'-view').classList.remove('hidden');const titles={timeline:['Таймлайн операций','Импорт и экспорт. От получения задания до финальной доставки.'],analytics:['Аналитика логистики','Скорость прохождения этапов и эффективность операций.'],archive:['Архив операций','История завершённых поставок и архивированные кейсы.'],audit:['Журнал изменений','История действий и корректировок по операциям.']};$('page-title').innerHTML=titles[view][0]+'<span class="title-dot">.</span>';$('page-subtitle').textContent=titles[view][1];$('breadcrumb-title').textContent=titles[view][0];if(view==='timeline'&&isMobileCalendarDevice())openMobileCalendar();else if(view!=='timeline')closeMobileCalendar();}
  function openModal(id){$(id).classList.remove('hidden');document.body.style.overflow='hidden';}
  function closeModal(id){$(id).classList.add('hidden');if([...document.querySelectorAll('.modal-layer')].every(x=>x.classList.contains('hidden')))document.body.style.overflow='';}
  function toast(msg,error=false){const node=document.createElement('div');node.className='toast'+(error?' error':'');node.textContent=msg;$('toast-stack').append(node);setTimeout(()=>node.remove(),4300);}
  function showError(id,msg){const el=$(id);el.textContent=msg;el.classList.toggle('hidden',!msg);}
  function newOperation(){const form=$('operation-form');form.reset();$('op-date').value=TODAY;showError('operation-error','');openModal('operation-modal');setTimeout(()=>$('op-company').focus(),40);}
  function existingEventsHtml(es){if(!es.length)return '';return '<div class="existing-heading">СОБЫТИЯ НА ВЫБРАННУЮ ДАТУ</div>'+es.map(e=>`<div class="existing-item"><span class="event-type-dot ${e.type}"></span><div class="existing-item-info"><strong>${esc(statusFor(e.status).label)}</strong><small>${e.type==='planned'?'План':'Факт'}${e.note?' · '+esc(e.note):''}</small></div><button class="tiny-button" data-edit-event="${esc(e.id)}">Изм.</button><button class="tiny-button danger" data-delete-event="${esc(e.id)}">×</button></div>`).join('');}
  function defaultEventType(status){return statusFor(status).allowed==='planned'?'planned':'actual';}
  function openEvent(operationId,date,editId=null){
    const op=state.operations.find(o=>o.id===operationId);if(!op)return;
    state.activeOperation=operationId;state.activeDate=date;$('event-operation-caption').textContent=op.direction+' · '+op.company;$('event-modal-title').textContent=formatDate(date,{day:'numeric',month:'long',year:'numeric'});
    $('event-operation-id').value=operationId;$('event-edit-id').value=editId||'';$('event-date').value=date;$('event-note').value='';
    const statusSelect=$('event-status');statusSelect.innerHTML=STATUS.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');statusSelect.value='received';
    const es=operationEvents(operationId).filter(e=>e.date===date);$('existing-events').innerHTML=existingEventsHtml(es);
    if(editId){const e=operationEvents(operationId).find(e=>e.id===editId);if(e){$('event-date').value=e.date;statusSelect.value=e.status;$('event-note').value=e.note||'';document.querySelector(`input[name="event-type"][value="${e.type}"]`).checked=true;}}
    else{const initial=es.length?'search_transport':'received';statusSelect.value=initial;document.querySelector(`input[name="event-type"][value="${defaultEventType(initial)}"]`).checked=true;}
    $('event-submit').textContent=editId?'Обновить событие ↗':'Сохранить статус ↗';showError('event-error','');openModal('event-modal');
  }
  function openDrawer(id){const op=state.operations.find(o=>o.id===id);if(!op)return;state.activeOperation=id;const es=operationEvents(id),cycle=cycleDays(op),status=delivered(op)?'Завершена':correctOverdue(op)?'Есть отклонения':'В работе';
    $('drawer-content').innerHTML=`<h2 class="drawer-title">${esc(op.company)}</h2><p class="drawer-desc">${esc(op.goods)}</p><div class="drawer-identity"><span class="direction-tag ${op.direction.toLowerCase()}">${op.direction}</span><span class="info-pill">${status}</span></div><div class="drawer-stats"><div class="drawer-stat"><strong>${cycle!==null?cycle:'—'}</strong><small>Дней полного цикла</small></div><div class="drawer-stat"><strong>${es.length}</strong><small>Событий</small></div></div>${op.note?`<p style="font-size:12px;color:#a8b9ca;margin-top:18px">${esc(op.note)}</p>`:''}<div class="drawer-section-title">ХРОНОЛОГИЯ СОБЫТИЙ</div>${es.length?es.map(e=>`<div class="drawer-event"><div class="drawer-event-bullet ${e.type}"></div><div><strong>${esc(statusFor(e.status).label)}</strong><small>${esc(formatDate(e.date))} · ${e.type==='planned'?'План':'Факт'}</small>${e.note?`<p>${esc(e.note)}</p>`:''}</div></div>`).join(''):'<p>Пока нет событий</p>'}<div class="drawer-buttons"><button class="btn btn-primary" id="drawer-add-event">+ Событие</button><button class="btn btn-outline" id="drawer-archive">${op.archived?'Вернуть из архива':'В архив'}</button></div>`;
    $('drawer-backdrop').classList.remove('hidden');$('detail-drawer').classList.remove('hidden');document.body.style.overflow='hidden';
    $('drawer-add-event').onclick=()=>{closeDrawer();openEvent(id,TODAY);};
    $('drawer-archive').onclick=()=>{if(!confirm(op.archived?'Вернуть операцию из архива?':'Переместить операцию в архив?'))return;const button=$('drawer-archive');guarded(async()=>{await backendCall('apiArchiveOperation',id,!op.archived);closeDrawer();toast(op.archived?'Операция восстановлена':'Операция архивирована');},button);};
  }
  function closeDrawer(){$('drawer-backdrop').classList.add('hidden');$('detail-drawer').classList.add('hidden');document.body.style.overflow='';}
  function csvExport(){const headers=['Операция ID','Направление','Компания','Товар','Дата задания','Дата события','Статус','Тип','Комментарий'];const lines=[headers];state.operations.forEach(op=>{const ev=operationEvents(op.id);ev.forEach(e=>lines.push([op.id,op.direction,op.company,op.goods,op.createdAt,e.date,statusFor(e.status).label,e.type==='actual'?'Факт':'План',e.note||'']));});const csv='\ufeff'+lines.map(row=>row.map(v=>{const t=String(v??'');const safe=/^[=+\-@\t\r]/.test(t)?'\''+t:t;return '"'+safe.replace(/"/g,'""')+'"';}).join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='OSV_IMPEX_'+TODAY+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);toast('CSV-файл подготовлен');}
  /* Reliable mobile double-tap, with movement/pinch rejection.
     Native dblclick is retained for mouse and trackpad users. */
  let lastMobileCellOpen=0;
  function installCalendarDoubleTap(){
    const scroller=$('timeline-scroller');
    let fingerStart=null,lastTap=null;
    const reset=()=>{fingerStart=null;lastTap=null;};
    scroller.addEventListener('touchstart',e=>{
      if(e.touches.length!==1){reset();return;}
      const target=e.target.closest('.day-slot');
      if(!target){fingerStart=null;return;}
      const t=e.touches[0];
      fingerStart={target,x:t.clientX,y:t.clientY,time:Date.now()};
    },{passive:true});
    scroller.addEventListener('touchmove',e=>{
      if(!fingerStart)return;
      if(e.touches.length!==1){reset();return;}
      const t=e.touches[0];
      if(Math.hypot(t.clientX-fingerStart.x,t.clientY-fingerStart.y)>12){reset();}
    },{passive:true});
    scroller.addEventListener('touchend',e=>{
      const tap=fingerStart;fingerStart=null;
      if(e.touches.length||!tap||Date.now()-tap.time>500)return;
      const now=Date.now();
      if(lastTap&&lastTap.target===tap.target&&now-lastTap.time<=420){
        lastTap=null;
        e.preventDefault(); // prevent emulated click/double-click after a confirmed double-tap
        lastMobileCellOpen=now;
        openEvent(tap.target.dataset.op,tap.target.dataset.date);
      }else{
        lastTap={target:tap.target,time:now};
      }
    },{passive:false});
    scroller.addEventListener('touchcancel',reset,{passive:true});
  }
  function attachEvents(){
    installTimelinePinch();
    installCalendarDoubleTap();
    $('mobile-orientation-dismiss').addEventListener('click',()=>$('mobile-orientation-tip').classList.add('is-dismissed'));
    $('mobile-calendar-back').addEventListener('click',closeMobileCalendar);
    $('mobile-calendar-fullscreen').addEventListener('click',toggleMobileCalendarFullscreen);
    document.addEventListener('fullscreenchange',updateMobileCalendarFullscreen);
    window.addEventListener('resize',()=>{
      if(document.body.classList.contains('mobile-calendar-mode')&&!isMobileCalendarDevice())closeMobileCalendar();
    });
    document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
    $('new-operation-btn').addEventListener('click',newOperation);
    $('search-input').addEventListener('input',e=>{state.query=e.target.value;renderTimeline(true);});
    $('direction-filter').addEventListener('change',e=>{state.direction=e.target.value;renderTimeline(true);});
    $('state-filter').addEventListener('change',e=>{state.filter=e.target.value;renderTimeline(true);});
    $('today-btn').addEventListener('click',()=>scrollToDate(TODAY));
    $('prev-week').addEventListener('click',()=>shiftWeek(-1));$('next-week').addEventListener('click',()=>shiftWeek(1));
    $('export-btn').addEventListener('click',csvExport);
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
    document.querySelectorAll('.modal-layer').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)closeModal(el.id);}));
    $('close-drawer').addEventListener('click',closeDrawer);$('drawer-backdrop').addEventListener('click',closeDrawer);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-layer:not(.hidden)').forEach(el=>closeModal(el.id));closeDrawer();}});
    // Opening a status is an intentional double action, never a single scroll/tap.
    document.addEventListener('dblclick',e=>{
      const slot=e.target.closest('.day-slot');
      if(!slot||Date.now()-lastMobileCellOpen<700)return;
      e.preventDefault();
      openEvent(slot.dataset.op,slot.dataset.date);
    });
    document.addEventListener('click',e=>{
      const op=e.target.closest('[data-open-op]');if(op){openDrawer(op.dataset.openOp);return;}
      const edit=e.target.closest('[data-edit-event]');if(edit){openEvent(state.activeOperation,state.activeDate,edit.dataset.editEvent);return;}
      const del=e.target.closest('[data-delete-event]');if(del){const id=del.dataset.deleteEvent,opid=state.activeOperation,date=state.activeDate;if(!confirm('Удалить событие? История изменения сохранится в журнале.'))return;guarded(async()=>{await backendCall('apiDeleteEvent',opid,id);closeModal('event-modal');toast('Событие удалено');});}
    });
    $('event-status').addEventListener('change',e=>{document.querySelector(`input[name="event-type"][value="${defaultEventType(e.target.value)}"]`).checked=true;});
    $('operation-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,btn=form.querySelector('button[type=submit]');const fd=new FormData(form);const p={direction:fd.get('direction'),company:String(fd.get('company')||'').trim(),goods:String(fd.get('goods')||'').trim(),date:String(fd.get('date')||''),note:String(fd.get('note')||'').trim()};if(!p.company||!p.goods||!/\d{4}-\d{2}-\d{2}/.test(p.date)){showError('operation-error','Заполните обязательные поля');return;}guarded(async()=>{await backendCall('apiCreateOperation',p);closeModal('operation-modal');toast('Операция создана');},btn);});
    $('event-form').addEventListener('submit',e=>{e.preventDefault();const btn=$('event-submit');const operationId=$('event-operation-id').value, p={id:$('event-edit-id').value||'',date:$('event-date').value,status:$('event-status').value,type:document.querySelector('input[name="event-type"]:checked').value,note:$('event-note').value.trim()};if(!p.date||!BY_STATUS[p.status]){showError('event-error','Заполните дату и статус');return;}guarded(async()=>{await backendCall('apiSaveEvent',operationId,p);closeModal('event-modal');toast(p.id?'Событие обновлено':'Событие сохранено');},btn);});
    $('timeline-scroller').addEventListener('scroll',()=>{
      positionTimelineWatermarks();
      const s=$('timeline-scroller');if(s.scrollLeft+s.clientWidth>s.scrollWidth-dayWidth()*14&&state.end<addDays(TODAY,700)){
        const x=s.scrollLeft,y=s.scrollTop;state.end=addDays(state.end,70);renderTimeline(true);requestAnimationFrame(()=>{s.scrollLeft=x;s.scrollTop=y;});
      }
    },{passive:true});
    $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;showError('login-error','');try{const result=await gasCall('apiLogin',$('login-password').value);if(!result?.token)throw Error('Сервер не выдал сессию');state.token=result.token;try{sessionStorage.setItem(SESSION_KEY,result.token);}catch{}await startWorkspace();}catch(err){showError('login-error',err?.message||'Ошибка авторизации');}finally{btn.disabled=false;}});
    $('logout-btn').addEventListener('click',async()=>{try{await gasCall('apiLogout',state.token);}catch{}state.token=null;try{sessionStorage.removeItem(SESSION_KEY);}catch{}$('workspace').classList.add('hidden');$('login').classList.remove('hidden');});
  }
  async function startWorkspace(){
    if(IS_GAS){const raw=await gasCall('apiBootstrap',state.token);Object.assign(state,normalized(raw));$('environment-badge').classList.add('live');$('environment-badge').innerHTML='<i></i> LIVE';const connectionLabel=$('connection-label');if(connectionLabel)connectionLabel.textContent='Google Sheets · Online';$('logout-btn').hidden=false;}
    else{Object.assign(state,loadDemo());$('environment-badge').innerHTML='<i></i> ДЕМО';}
    const first=state.events.map(e=>e.date).sort()[0];if(first&&first<state.start)state.start=addDays(first,-12);
    const last=state.events.map(e=>e.date).sort().at(-1);if(last&&last>state.end)state.end=addDays(last,50);
    $('login').classList.add('hidden');$('workspace').classList.remove('hidden');
    $('top-date').textContent=formatDate(TODAY,{day:'numeric',month:'long',year:'numeric'});
    renderAll();setView(state.view);state.initialized=true;
  }
  async function init(){attachEvents();if(IS_GAS){$('workspace').classList.add('hidden');let cached=null;try{cached=sessionStorage.getItem(SESSION_KEY);}catch{}if(cached){state.token=cached;try{await startWorkspace();return;}catch{try{sessionStorage.removeItem(SESSION_KEY);}catch{}state.token=null;}}$('login').classList.remove('hidden');}else await startWorkspace();}
  init().catch(e=>{toast('Ошибка запуска: '+(e.message||e),true);console.error(e);});
})();

/* Sidebar gallery: three complete photos hosted on our own site; randomized without repeats. */
(function initOsbSidebarThreeUp(){
  const gallery=document.querySelector('.sidebar-gallery[data-gallery="osv"]');
  if(!gallery)return;
  const slots=Array.from(gallery.querySelectorAll('.sidebar-gallery-slot'));
  if(slots.length!==3)return;

  // Source of truth: uploaded files in sp-automation/OSV_impex_tracking/Images.
  // Images are served by OUR domain, not osv.com.ua, DirectIndustry or GitHub raw.
  const filenames=["01.jpg","01.png","016-1.jpg","02-1.png","03.png","143-scaled-e1603368966340.jpg","170-1-scaled-e1603367407650.jpg","2-1024x1024.jpg","20200601_112324-scaled.jpg","2026-04-29-1024x768.jpeg","3-kopiya-1024x768.jpg","anton.jpg","bez-nazvy-1.jpg","img_4793-1024x753.jpg","katalog-osv-1024x727.png","katya.jpg","ksyusha.jpg","lp01_7_5_kg_start_extended_hr-photoroom-kopiya-1024x678.jpg","natasha.jpg","oleg.jpg","osv-2020-800x800-2-scaled.jpg","osv-m12-10k-mdi-1.jpeg","osv-mini-ab-1024x685.jpg","osv-mini-dynamica.jpg","osv-on-linkedin-—-mini-ab-for-pu-edge-1024x685.png","osv-s1-2k-static-abrasive-—-05-1024x768.jpeg","sasha.jpg","seryozha.jpg","sydene-yz-ppu-—-01.jpeg","whatsapp-image-2020-12-02-at-08.51.12-1024x576.jpeg","whatsapp-image-2026-07-05-at-22.44.50-1-1024x768.jpeg","yana.jpg","yura.jpg","yurchik.jpg","zobrazhennya-whatsapp-data_-2025-11-19-o-14.54.57_ab810c1d-1024x685.jpg","zobrazhennya-whatsapp-data_-2025-12-10-o-16.42.00_5ae8aab6-1024x768.jpg"];
  const base='https://sp-automation.com/OSV_impex_tracking/Images/';
  const photos=filenames.map(name=>base+encodeURIComponent(name));
  const broken=new Set();
  const visible=[null,null,null];
  let lastSlot=-1,changing=false;
  const prefersReducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shuffle=list=>{
    const result=list.slice();
    for(let i=result.length-1;i>0;i--){
      const k=Math.floor(Math.random()*(i+1));
      [result[i],result[k]]=[result[k],result[i]];
    }
    return result;
  };
  // Shuffle bag: use each photo before repeating, excluding currently shown photos.
  let bag=shuffle(photos);
  const nextPhoto=()=>{
    for(let pass=0;pass<2;pass++){
      const pos=bag.findIndex(url=>!broken.has(url)&&!visible.includes(url));
      if(pos>=0)return bag.splice(pos,1)[0];
      bag=shuffle(photos.filter(url=>!broken.has(url)&&!visible.includes(url)));
    }
    return null;
  };
  const load=(url,onLoad,onError)=>{
    const probe=new Image();
    probe.onload=onLoad;
    probe.onerror=onError;
    probe.src=url;
  };

  // Random three-image opening, never three copies of the same image.
  slots.forEach((slot,index)=>{
    const first=slot.querySelector('.sidebar-gallery-img.is-visible');
    let attempts=0;
    const start=()=>{
      if(attempts++>=photos.length)return;
      const url=nextPhoto();
      if(!url)return;
      visible[index]=url; // reserve while the image loads to avoid duplicates
      load(url,()=>{first.src=url;},()=>{
        broken.add(url);
        visible[index]=null;
        start();
      });
    };
    start();
  });

  if(prefersReducedMotion)return;
  const schedule=()=>window.setTimeout(tick,7000+Math.floor(Math.random()*4500));
  function tick(){
    if(document.hidden||changing){schedule();return;}
    const options=[0,1,2].filter(n=>n!==lastSlot);
    const index=options[Math.floor(Math.random()*options.length)];
    const url=nextPhoto();
    if(!url){schedule();return;}
    const images=Array.from(slots[index].querySelectorAll('.sidebar-gallery-img'));
    const current=images.find(img=>img.classList.contains('is-visible'));
    const next=images.find(img=>img!==current);
    if(!current||!next){schedule();return;}
    changing=true;
    load(url,()=>{
      next.src=url;
      requestAnimationFrame(()=>{
        next.classList.add('is-visible');
        current.classList.remove('is-visible');
        visible[index]=url;
        lastSlot=index;
        changing=false;
        schedule();
      });
    },()=>{
      broken.add(url);
      changing=false;
      schedule();
    });
  }
  schedule();
})();

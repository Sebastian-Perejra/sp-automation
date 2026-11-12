/* OSV IMPEX Tracking — browser demo + Google Apps Script client, no external dependencies. */
(() => {
  'use strict';
  const DAY_MS = 86400000;
  const STORAGE_KEY = 'osv-impex-demo-v1';
  const SESSION_KEY = 'osv-impex-session';
  const IS_GAS = !!(window.google && google.script && google.script.run);
  let TODAY = iso(new Date());
  const STATUS = [
    {id:'received', label:'Задание получено', short:'Получено', stage:'intake', allowed:'actual'},
    {id:'search_transport', label:'Поиск транспорта', short:'Поиск ТС', stage:'transport', allowed:'actual'},
    {id:'transport_booked', label:'Транспорт согласован', short:'ТС найден', stage:'transport', allowed:'actual'},
    {id:'waiting_loading', label:'Ожидает постановки под загрузку', short:'Ожид. загрузки', stage:'transport', allowed:'actual'},
    {id:'loaded', label:'Груз загружен', short:'Загружен', stage:'transport', allowed:'actual'},
    {id:'en_route_customs', label:'В пути на таможню', short:'В пути к там.', stage:'transport', allowed:'actual'},
    {id:'en_route_delivery', label:'В пути на выгрузку', short:'В пути к выг.', stage:'delivery', allowed:'actual'},
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
    activeOperation:null, activeDate:null, initialized:false, role:'editor'
  };
  const $ = id => document.getElementById(id);
  function canEdit(){return state.role==='editor';}
  function requireEditor(){
    if(canEdit())return true;
    toast('Только просмотр: изменение данных запрещено.',true);return false;
  }
  function applyRole(){
    const viewOnly=!canEdit(),badge=$('access-role-badge');
    document.body.classList.toggle('viewer-mode',viewOnly);
    if(badge){badge.hidden=false;badge.textContent=viewOnly?'◉ VIEW ONLY':'● EDITOR';badge.title=viewOnly?'Только просмотр':'Редактирование разрешено';}
    $('new-operation-btn').hidden=viewOnly;
  }
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
  function runningAgeDays(events,asOf=TODAY){
    if(events.some(e=>e.status==='delivered'&&e.type==='actual'))return null;
    const first=events.find(e=>e.type==='actual'&&e.date<=asOf);
    return first?Math.max(0,dayDiff(first.date,asOf)):null;
  }
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
    if(!canEdit()&&['apiCreateOperation','apiSaveEvent','apiDeleteEvent','apiArchiveOperation'].includes(fn))return Promise.reject(Error('Недостаточно прав.'));
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
  async function guarded(action,button){if(!requireEditor()||state.isLoading)return;state.isLoading=true;if(button)button.disabled=true;try{await action();if(IS_GAS)await reloadFromBackend();renderAll(true);}catch(e){toast(e.message||'Ошибка сохранения',true);}finally{state.isLoading=false;if(button)button.disabled=false;}}

  function renderMetrics(){
    const visible=state.operations.filter(o=>!o.archived);
    const active=visible.filter(o=>!delivered(o));
    const completed=visible.filter(delivered);
    const delays=visible.filter(correctOverdue);
    const cycles=completed.map(cycleDays).filter(n=>n!==null);
    const cards=[
      ['Активные операции',String(active.length),'В работе прямо сейчас','↗','','active'],
      ['Завершено',String(completed.length),'За весь период','✓','','completed'],
      ['Средний цикл',fmtMetric(avg(cycles)),'От задания до доставки','◷','дн.',null],
      ['С отклонениями',String(delays.length),'Плановая дата не соблюдена','⚑','','overdue']
    ];
    $('metrics').innerHTML=cards.map((m,i)=>{
      const filter=m[5],selected=filter===state.filter;
      const contents=`<div class="metric-top"><span>${m[0]}</span><span class="metric-symbol">${m[3]}</span></div><div class="metric-value"><strong>${m[1]}</strong><span class="unit">${m[4]}</span></div><div class="metric-bottom">${selected?'Нажмите ещё раз, чтобы снять фильтр':m[2]}</div>`;
      return filter?`<button type="button" data-metric-filter="${filter}" class="metric-card metric-filter ${selected?'is-selected':''} ${i===3&&delays.length?'metric-emphasis':''}" aria-pressed="${selected}" title="${selected?'Снять фильтр':'Показать только '+m[0].toLowerCase()}">${contents}</button>`:`<article class="metric-card">${contents}</article>`;
    }).join('');
    $('nav-active').textContent=active.length;
    const hasFilter=state.filter!=='all'||state.direction!=='all'||Boolean(state.query.trim());
    $('clear-filter-btn').classList.toggle('hidden',!hasFilter);
    $('state-filter').value=state.filter;
  }
  function setMetricFilter(filter){
    state.filter=state.filter===filter?'all':filter;
    renderMetrics();
    renderTimeline(true);
  }
  function clearAllTimelineFilters(){
    state.filter='all';state.direction='all';state.query='';
    $('search-input').value='';
    $('direction-filter').value='all';
    $('state-filter').value='all';
    renderMetrics();
    renderTimeline(true);
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
  function displayPinchHint(){ /* onboarding overlay removed */ }
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
      /* pinch hint removed */
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
      renderTimeline(true); // redraw cells at the current zoom level
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
    for(const op of rows){
      const es=operationEvents(op.id);const byDate={};for(const e of es)(byDate[e.date]??=[]).push(e);
      const ageDays=runningAgeDays(es,TODAY);
      html+=`<div class="timeline-row" data-row-op="${esc(op.id)}"><div class="timeline-row-label" data-open-op="${esc(op.id)}" title="Открыть карточку операции"><span class="direction-tag ${op.direction.toLowerCase()}">${esc(op.direction)}</span><div class="op-main"><strong title="${esc(op.company)}">${esc(op.company)}</strong><small title="${esc(op.goods)}">${esc(op.goods)}</small></div><span class="op-label-right">›</span></div>`;
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
        const showAge=d===TODAY&&ageDays!==null;
        const ageBand=ageDays>=14?'age-critical':ageDays>=7?'age-watch':'age-normal';
        const ageBadge=showAge?`<span class="operation-age ${ageBand}" role="img" aria-label="В работе ${ageDays} дн." title="В работе ${ageDays} дн. · с ${formatDate(es.find(e=>e.type==='actual'&&e.date<=TODAY).date)}">${ageDays}</span>`:'';
        html+=`<div class="day-slot ${phase?'phase-'+phase:''} ${isWeekend?'weekend':''} ${showAge?'has-operation-age':''} ${actualDelivery?'is-delivered':''}" data-op="${esc(op.id)}" data-date="${d}" title="${esc(formatDate(d))} · ${esc(op.company)}${showAge?' · В работе '+ageDays+' дн.':''} · телефон: 2 касания — хронология, 3 касания — события дня · ПК: двойной клик — редактировать">${chip||'<span class="slot-add">+</span>'}${deliveredFlag}${ageBadge}</div>`;
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
    requestAnimationFrame(()=>{if(prevX===null){if(todayIdx>=0)scroller.scrollLeft=calendarDateLeft(todayIdx,scroller);scroller.scrollTop=0;}else{scroller.scrollLeft=prevX;scroller.scrollTop=prevY;}positionTimelineWatermarks();});
  }
  function dayWidth(){return parseFloat(getComputedStyle($('timeline-scroller')).getPropertyValue('--day-width'))||79;}
  function calendarDateLeft(idx,scroller){
    const width=scroller.clientWidth||window.innerWidth;
    const label=timelineLabelWidth(),dw=dayWidth();
    // On mobile the left label scrolls with dates; on desktop it stays fixed.
    const viewportCenter=isMobileCalendarDevice()?width/2:(width+label)/2;
    return Math.max(0,label+idx*dw+dw/2-viewportCenter);
  }
  function scrollToDate(d){
    if(state.view!=='timeline')setView('timeline');
    if(d<state.start){state.start=addDays(d,-30);renderTimeline();}
    if(d>state.end){state.end=addDays(d,70);renderTimeline();}
    const scroller=$('timeline-scroller'),idx=dayDiff(state.start,d);
    requestAnimationFrame(()=>scroller.scrollTo({left:calendarDateLeft(idx,scroller),behavior:'auto'}));
  }
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
  function renderAll(preserve=false){applyRole();renderMetrics();renderTimeline(preserve);renderStages();renderAnalytics();renderArchive();renderAudit();}

  /* Shared event-backed stage tracker. Confirmed events only — no synthetic checkmarks. */
  const STAGES=[
    {id:'received',label:'Получена заявка'},
    {id:'search_transport',label:'Поиск транспорта'},
    {id:'transport_booked',label:'Транспорт найден'},
    {id:'waiting_loading',label:'Ожидание загрузки'},
    {id:'loaded',label:'Загружен'},
    {id:'en_route_customs',label:'В пути на таможню'},
    {id:'customs_arrived',label:'Таможенное оформление'},
    {id:'customs_cleared',label:'Оформлено'},
    {id:'en_route_delivery',label:'В пути на выгрузку'},
    {id:'delivered',label:'Выгружен'}
  ];
  const STAGE_INDEX=Object.fromEntries(STAGES.map((s,i)=>[s.id,i]));
  // Legacy statuses are mapped for display but are not retroactively fabricated in history.
  const STAGE_LEGACY={loading_actual:'waiting_loading',pickup_actual:'loaded'};
  let timelineDisplay='calendar',selectedTruckOperation=null;
  const truckGraphic="<svg class=\"stage-truck-art\" viewBox=\"0 0 96 52\" aria-hidden=\"true\" focusable=\"false\"><defs><linearGradient id=\"truckBody\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop stop-color=\"#f8ffff\"/><stop offset=\"1\" stop-color=\"#d3e0ea\"/></linearGradient></defs><ellipse cx=\"48\" cy=\"46\" rx=\"36\" ry=\"3\" fill=\"#153a51\" opacity=\".16\"/><rect x=\"6\" y=\"10\" width=\"54\" height=\"30\" rx=\"4\" fill=\"url(#truckBody)\" stroke=\"#647f93\" stroke-width=\"1.5\"/><path d=\"M59 19h16l13 13v8H59z\" fill=\"#d52131\" stroke=\"#951728\" stroke-width=\"1.6\"/><path d=\"M64 22h10l9 10H64z\" fill=\"#bce4f2\" stroke=\"#951728\" stroke-width=\"1\"/><rect x=\"11\" y=\"16\" width=\"38\" height=\"4\" rx=\"2\" fill=\"#cc2335\" opacity=\".8\"/><rect x=\"11\" y=\"24\" width=\"29\" height=\"2\" rx=\"1\" fill=\"#9dacb9\"/><circle cx=\"25\" cy=\"41\" r=\"8\" fill=\"#263746\"/><circle cx=\"25\" cy=\"41\" r=\"3.5\" fill=\"#c5d8e1\"/><circle cx=\"73\" cy=\"41\" r=\"8\" fill=\"#263746\"/><circle cx=\"73\" cy=\"41\" r=\"3.5\" fill=\"#c5d8e1\"/><rect x=\"86\" y=\"34\" width=\"4\" height=\"5\" fill=\"#f6c662\"/></svg>";
  function stageIndex(status){
    const key=STAGE_LEGACY[status]||status;
    return Object.prototype.hasOwnProperty.call(STAGE_INDEX,key)?STAGE_INDEX[key]:null;
  }
  function stageFacts(op){
    const actual=operationEvents(op.id).filter(e=>e.type==='actual'&&e.date<=TODAY);
    const statusEvents=actual.filter(e=>stageIndex(e.status)!==null);
    const latest=statusEvents[statusEvents.length-1];
    const current=latest?stageIndex(latest.status):null;
    const first=actual.find(e=>e.status==='received')||statusEvents[0]||null;
    const finalEvent=statusEvents.find(e=>e.status==='delivered');
    const asOf=finalEvent?finalEvent.date:TODAY;
    const stageDays=latest?Math.max(0,dayDiff(latest.date,asOf)):null;
    const totalDays=first?Math.max(0,dayDiff(first.date,asOf)):null;
    const confirmed=new Set(statusEvents.map(e=>stageIndex(e.status)));
    const pause=actual.some(e=>e.status==='hold'&&(!latest||e.date>=latest.date));
    return {current,stageDays,totalDays,confirmed,pause,latest,first};
  }
  function currentStageRows(){return filteredOperations();}
  function renderStages(){
    const rows=currentStageRows();
    const counts=STAGES.map(()=>0);
    const facts=rows.map(op=>{const f=stageFacts(op);if(f.current!==null)counts[f.current]++;return {op,f};});
    $('stage-grid').style.setProperty('--stage-count',String(STAGES.length));
    let out='<div class="stage-corner">ГРУЗ / ОПЕРАЦИЯ <small>'+rows.length+' записей</small></div>';
    out+=STAGES.map((s,i)=>'<div class="stage-heading"><span>'+esc(s.label)+'</span><strong title="Грузов сейчас на этапе">'+counts[i]+'</strong></div>').join('');
    for(const {op,f} of facts){
      const current=f.current;
      const late=correctOverdue(op);
      out+='<div class="stage-op" data-stage-open="'+esc(op.id)+'" tabindex="0" role="button" title="Открыть хронологию"><div class="stage-op-head"><span class="direction-tag '+op.direction.toLowerCase()+'">'+esc(op.direction)+'</span><strong>'+esc(op.company)+'</strong></div><small>'+esc(op.goods)+'</small><div class="stage-op-meta">'+(f.totalDays===null?'Нет факта старта':f.totalDays+' дн. всего')+(late?' · ⚑ Отклонение':'')+'</div></div>';
      for(let i=0;i<STAGES.length;i++){
        const isCurrent=i===current,confirmed=f.confirmed.has(i)&&!isCurrent;
        let content='';
        if(isCurrent){
          const duration=f.stageDays+' / '+f.totalDays;
          content='<button class="stage-truck '+(late?'is-late ':'')+(f.pause?'is-paused':'')+'" type="button" draggable="'+(canEdit()?'true':'false')+'" data-truck="'+esc(op.id)+'" aria-label="'+esc(op.company)+' — '+esc(STAGES[i].label)+', '+duration+' дней" title="'+esc(op.company)+' — '+duration+' дн. (этап / всего)">'+truckGraphic+'<span>'+duration+'</span></button>';
        }else if(confirmed){
          content='<button type="button" class="stage-check" data-check-op="'+esc(op.id)+'" data-check-stage="'+i+'" title="Три щелчка — снять подтверждение" aria-label="Снять подтверждение: три щелчка">✓</button>';
        }else if(current!==null&&i<current){
          content='<span class="stage-skipped" title="Фактический этап не подтверждён">·</span>';
        }
        out+='<div class="stage-cell '+(isCurrent?'is-current ':'')+(current!==null&&i<current?'is-past ':'')+(i===9?'is-last ':'')+'" data-stage-target="'+i+'" data-stage-operation="'+esc(op.id)+'">'+content+'</div>';
      }
    }
    if(!rows.length)out+='<div class="stage-empty">Нет операций для выбранных фильтров.</div>';
    $('stage-grid').innerHTML=out;
    $('timeline-view-stages').classList.toggle('is-selected',timelineDisplay==='stages');
    $('timeline-view-calendar').classList.toggle('is-selected',timelineDisplay==='calendar');
    $('timeline-view-stages').setAttribute('aria-pressed',String(timelineDisplay==='stages'));
    $('timeline-view-calendar').setAttribute('aria-pressed',String(timelineDisplay==='calendar'));
  }
  function setTimelineDisplay(next){
    if(next!=='calendar'&&next!=='stages')return;
    if(next==='calendar')resetStageZoom();
    if(next==='stages'){
      resetDesktopCalendarZoom();
      if(document.body.classList.contains('mobile-calendar-mode'))closeMobileCalendar();
    }
    timelineDisplay=next;
    $('stages-view').classList.toggle('hidden',next!=='stages');
    $('timeline-scroller').classList.toggle('hidden',next==='stages');
    $('timeline-view').querySelector('.legend-under').classList.toggle('hidden',next==='stages');
    $('timeline-view').querySelector('.timeline-footer').classList.toggle('hidden',next==='stages');
    $('timeline-view').querySelector('.calendar-header-actions').classList.toggle('stage-active',next==='stages');
    $('mobile-calendar-open').style.display=next==='stages'?'none':'';
    renderStages();
  }

  /* Existing GAS endpoints provide audited, shared calendar/stage updates. */
  function stageEventRecords(opId){
    return operationEvents(opId).filter(e=>e.type==='actual'&&stageIndex(e.status)!==null);
  }
  async function performStageMove(opId,target){
    const op=state.operations.find(o=>o.id===opId),facts=op&&stageFacts(op);
    if(!op||op.archived||!facts||facts.current===null||delivered(op))throw Error('Невозможно изменить этап');
    if(target===facts.current)return;
    if(target<facts.current){
      const later=stageEventRecords(opId).filter(e=>stageIndex(e.status)>target&&e.status!=='received');
      for(const e of later)await backendCall('apiDeleteEvent',opId,e.id);
      if(target!==0)await backendCall('apiSaveEvent',opId,{date:TODAY,status:STAGES[target].id,type:'actual',note:'Откат: последующие этапы сняты'});
    }else{
      const existing=new Set(stageEventRecords(opId).map(e=>stageIndex(e.status)));
      for(let i=1;i<=target;i++){
        if(existing.has(i))continue;
        await backendCall('apiSaveEvent',opId,{date:TODAY,status:STAGES[i].id,type:'actual',note:i===target?'Перемещение машинки':'Автоподтверждение промежуточного этапа'});
      }
      if(existing.has(target))await backendCall('apiSaveEvent',opId,{date:TODAY,status:STAGES[target].id,type:'actual',note:'Возврат на ранее пройденный этап'});
    }
  }
  async function performCheckRemoval(opId,idx){
    if(idx===0)throw Error('Первое событие нельзя удалить');
    const op=state.operations.find(o=>o.id===opId);
    if(!op||delivered(op)||stageFacts(op).current<=idx)throw Error('Только пройденные этапы можно снять');
    for(const e of stageEventRecords(opId).filter(e=>stageIndex(e.status)===idx))
      await backendCall('apiDeleteEvent',opId,e.id);
  }
  async function runStageBatch(work,onComplete){
    if(!requireEditor()||state.isLoading)return;
    state.isLoading=true;
    try{await work();if(onComplete)onComplete();}
    catch(err){toast('Ошибка: '+(err.message||'неизвестно')+'. Часть изменений могла сохраниться — проверьте журнал.',true);}
    finally{
      try{if(IS_GAS)await reloadFromBackend();renderAll(true);}
      catch(err){toast('Не удалось обновить данные: '+err.message,true);}
      state.isLoading=false;
    }
  }
  function askRemoveStageCheck(opId,index){
    if(!requireEditor())return;
    const op=state.operations.find(o=>o.id===opId);
    if(!op||index===0)return;
    closeStageConfirm();
    const layer=document.createElement('div');
    layer.id='stage-confirm-overlay';layer.className='stage-confirm-overlay';
    layer.innerHTML='<section class="stage-confirm-card" role="dialog" aria-modal="true" aria-label="Снять отметку"><div class="stage-confirm-eyebrow">ПОДТВЕРЖДЕНИЕ ЭТАПА</div><h2>Снять галочку?</h2><p class="stage-confirm-shipment">'+esc(op.company)+'</p><div class="stage-confirm-warning"><span>!</span><span>Фактический этап «'+esc(STAGES[index].label)+'» удалится из календаря, но останется в журнале изменений.</span></div><div class="stage-confirm-actions"><button type="button" class="stage-confirm-cancel" data-stage-cancel>Отмена</button><button type="button" class="stage-confirm-approve" data-stage-approve>Снять</button></div></section>';
    layer.addEventListener('click',e=>{
      if(e.target===layer||e.target.closest('[data-stage-cancel]')){closeStageConfirm();return;}
      if(e.target.closest('[data-stage-approve]')){closeStageConfirm();runStageBatch(()=>performCheckRemoval(opId,index),()=>toast('Галочка снята'));}
    });
    document.body.appendChild(layer);
  }
  let stageZoomValue=1;
  function updateStageZoomUI(){
    $('stage-zoom-value').textContent=Math.round(stageZoomValue*100)+'%';
    $('stage-zoom-minus').disabled=stageZoomValue<=.7;
    $('stage-zoom-plus').disabled=stageZoomValue>=1.6;
    $('stage-zoom-close').hidden=!document.body.classList.contains('stage-zoom-overlay');
    $('stages-view').style.setProperty('--stage-zoom',String(stageZoomValue));
  }
  function stageOverlay(active){
    const b=$('calendar-zoom-backdrop');
    if(active){
      b.hidden=false;document.body.classList.add('stage-zoom-overlay');
      requestAnimationFrame(()=>b.classList.add('is-active'));
    }else{
      document.body.classList.remove('stage-zoom-overlay');
      b.classList.remove('is-active');
      setTimeout(()=>{if(!document.body.classList.contains('calendar-zoom-overlay')&&!document.body.classList.contains('stage-zoom-overlay'))b.hidden=true;},260);
    }
    updateStageZoomUI();
  }
  function setStageZoom(direction){
    const old=stageZoomValue,next=Math.round(Math.max(.7,Math.min(1.6,old+direction*.15))*100)/100;
    if(next===old)return;
    const scroller=$('stage-scroll'),x=(scroller.scrollLeft+scroller.clientWidth/2)/old,y=(scroller.scrollTop+scroller.clientHeight/2)/old;
    stageZoomValue=next;
    if(window.matchMedia('(min-width:900px) and (pointer:fine)').matches)stageOverlay(next>1);
    updateStageZoomUI();
    requestAnimationFrame(()=>{scroller.scrollLeft=Math.max(0,x*next-scroller.clientWidth/2);scroller.scrollTop=Math.max(0,y*next-scroller.clientHeight/2);});
  }
  function resetStageZoom(){stageZoomValue=1;stageOverlay(false);updateStageZoomUI();}

  function closeStageConfirm(){
    const layer=document.getElementById('stage-confirm-overlay');
    if(layer)layer.remove();
  }
  function promptStageMove(opId,stageNo){
    if(!requireEditor())return;
    const op=state.operations.find(o=>o.id===opId);
    if(!op||op.archived)return;
    const facts=stageFacts(op),target=STAGES[stageNo];
    if(!target||facts.current===stageNo)return;
    if(delivered(op)){toast('Завершённую поставку нельзя перемещать без корректировки истории.',true);return;}
    closeStageConfirm();
    const previous=facts.current===null?'Не определён':STAGES[facts.current].label;
    const forward=stageNo>facts.current;
    const layer=document.createElement('div');
    layer.id='stage-confirm-overlay';
    layer.className='stage-confirm-overlay';
    layer.innerHTML=`
      <section class="stage-confirm-card" role="dialog" aria-modal="true" aria-labelledby="stage-confirm-title" aria-describedby="stage-confirm-description">
        <div class="stage-confirm-header">
          <div class="stage-confirm-icon" aria-hidden="true">🚚</div>
          <button type="button" class="stage-confirm-x" data-stage-cancel aria-label="Закрыть">×</button>
        </div>
        <div class="stage-confirm-eyebrow">ИЗМЕНЕНИЕ ЭТАПА</div>
        <h2 id="stage-confirm-title">Подтвердить перемещение?</h2>
        <p id="stage-confirm-description" class="stage-confirm-shipment">${esc(op.company)} <span>· ${esc(op.goods)}</span></p>
        <div class="stage-confirm-route">
          <div><small>Текущий этап</small><strong>${esc(previous)}</strong></div>
          <span class="stage-confirm-arrow" aria-hidden="true">→</span>
          <div class="stage-confirm-destination"><small>Новый этап</small><strong>${esc(target.label)}</strong></div>
        </div>
        <div class="stage-confirm-date"><span aria-hidden="true">◷</span> Дата события: <strong>${esc(formatDate(TODAY))}</strong></div>
        <div class="stage-confirm-warning"><span>!</span><span>${forward?'Промежуточные этапы будут отмечены галочками.':'Жёсткий откат: все следующие фактические статусы удалятся из календаря.'} Все действия фиксируются в журнале.</span></div>
        <div class="stage-confirm-actions">
          <button type="button" class="stage-confirm-cancel" data-stage-cancel>Отмена</button>
          <button type="button" class="stage-confirm-approve" data-stage-approve>Подтвердить</button>
        </div>
      </section>`;
    const dismiss=()=>closeStageConfirm();
    layer.addEventListener('click',e=>{
      if(e.target===layer||e.target.closest('[data-stage-cancel]')){dismiss();return;}
      const approve=e.target.closest('[data-stage-approve]');
      if(!approve||approve.disabled)return;
      approve.disabled=true;
      approve.textContent='Сохранение…';
      runStageBatch(()=>performStageMove(opId,stageNo),()=>{
        closeStageConfirm();
        toast('Этап обновлён: '+target.label);
      }).finally(()=>{
        if(document.getElementById('stage-confirm-overlay')===layer){
          approve.textContent='Подтвердить';
          approve.disabled=false;
        }
      });
    });
    document.body.appendChild(layer);
    const cancel=layer.querySelector('.stage-confirm-cancel');
    if(cancel)cancel.focus();
  }
  function closeStagePicker(){
    const picker=document.getElementById('stage-picker-overlay');
    if(picker)picker.remove();
  }
  function openStagePicker(opId){
    const op=state.operations.find(o=>o.id===opId);
    if(!op)return;
    closeStagePicker();
    const facts=stageFacts(op);
    const current=facts.current===null?'Не определён':STAGES[facts.current].label;
    const disabled=!canEdit()||op.archived||delivered(op);
    // One reliable chronological source for both the calendar and this view.
    // Multiple events for a stage are retained; show its latest factual date.
    const history=operationEvents(opId).filter(e=>e.type==='actual'&&e.date<=TODAY&&stageIndex(e.status)!==null);
    const byStage=new Map();
    for(const event of history){
      const index=stageIndex(event.status);
      const previous=byStage.get(index);
      if(!previous||event.date>previous.date||(event.date===previous.date&&String(event.createdAt||'')>=String(previous.createdAt||'')))
        byStage.set(index,event);
    }
    const lastDay=facts.latest?.date||TODAY;
    const layer=document.createElement('div');
    layer.id='stage-picker-overlay';
    layer.className='stage-picker-overlay';
    const fmt=d=>formatDate(d,{day:'2-digit',month:'short',year:'numeric'});
    layer.innerHTML='<div class="stage-picker-card" role="dialog" aria-modal="true" aria-label="История этапов и изменение статуса">'
      +'<div class="stage-picker-head"><div><strong>'+esc(op.company)+'</strong><small>'+esc(op.goods)+'</small></div><button type="button" data-picker-close aria-label="Закрыть">×</button></div>'
      +'<div class="stage-picker-summary"><span>Текущий этап: <strong>'+esc(current)+'</strong></span><span>Дней на этапе / всего: <strong>'+esc(facts.stageDays===null?'—':facts.stageDays)+' / '+esc(facts.totalDays===null?'—':facts.totalDays)+'</strong></span></div>'
      +'<div class="stage-picker-section"><strong>История прохождения этапов</strong><small>Дата — из фактического события в календаре</small></div>'
      +'<div class="stage-picker-choices">'+STAGES.map((s,i)=>{
        const event=byStage.get(i);
        const active=i===facts.current;
        const completed=!!event&&!active;
        const date=event?fmt(event.date):'Нет события';
        const automated=!!event&&/Автоподтверждено|Автоподтверждение/.test(event.note||'');
        const duration=active&&facts.stageDays!==null?facts.stageDays+' дн. на этапе':'';
        const className=active?'stage-choice-current':completed?'stage-choice-done':'stage-choice-pending';
        return '<button type="button" class="'+className+'" data-stage-choice="'+i+'" '+(disabled||active?'disabled':'')+'>'
          +'<span class="stage-picker-index">'+(i+1)+'</span>'
          +'<span class="stage-picker-name"><strong>'+esc(s.label)+'</strong><small class="stage-picker-date">'+(event?'◷ ':'')+esc(date)+(automated?' · Авто':'')+'</small></span>'
          +(active?'<span class="stage-picker-current">Текущий'+(duration?'<small>'+esc(duration)+'</small>':'')+'</span>':completed?'<span class="stage-picker-done" aria-label="Этап подтверждён">✓</span>':'')
          +'</button>';
      }).join('')+'</div>'
      +'<p>Выберите этап, чтобы изменить статус. Даты в истории обновляются вместе с календарём. При движении вперёд промежуточные этапы подтверждаются, при откате назад последующие снимаются.</p>'
      +'</div>';
    layer.addEventListener('click',e=>{
      if(e.target===layer||e.target.closest('[data-picker-close]')){closeStagePicker();return;}
      const target=e.target.closest('[data-stage-choice]');
      if(!target||target.disabled)return;
      const index=Number(target.dataset.stageChoice);
      closeStagePicker();promptStageMove(opId,index);
    });
    document.body.appendChild(layer);
  }
  function installStageInteractions(){
    $('timeline-view-calendar').addEventListener('click',()=>setTimelineDisplay('calendar'));
    $('timeline-view-stages').addEventListener('click',()=>setTimelineDisplay('stages'));
    $('stage-zoom-minus').addEventListener('click',()=>setStageZoom(-1));
    $('stage-zoom-plus').addEventListener('click',()=>setStageZoom(1));
    $('stage-zoom-close').addEventListener('click',resetStageZoom);
    updateStageZoomUI();
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeStagePicker();closeStageConfirm();}});
    const grid=$('stage-grid');
    grid.addEventListener('click',e=>{
      if(e.target.closest('[data-check-op]'))return;
      const truck=e.target.closest('[data-truck]');
      if(truck){openStagePicker(truck.dataset.truck);return;}
      const op=e.target.closest('[data-stage-open]');
      if(op)openDrawer(op.dataset.stageOpen);
    });
    grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-stage-open]')){e.preventDefault();openDrawer(e.target.dataset.stageOpen);}});
    grid.addEventListener('click',e=>{const b=e.target.closest('[data-check-op]');if(b&&canEdit()&&e.detail>=3){e.preventDefault();askRemoveStageCheck(b.dataset.checkOp,Number(b.dataset.checkStage));}});
    let checkHold=0,checkButton=null;
    grid.addEventListener('touchstart',e=>{const b=e.target.closest('[data-check-op]');if(!b||!canEdit()||e.touches.length!==1)return;checkButton=b;checkHold=setTimeout(()=>{if(checkButton===b)askRemoveStageCheck(b.dataset.checkOp,Number(b.dataset.checkStage));checkButton=null;},650);},{passive:true});
    for(const evt of ['touchmove','touchend','touchcancel'])grid.addEventListener(evt,()=>{clearTimeout(checkHold);checkButton=null;},{passive:true});
    grid.addEventListener('dragstart',e=>{
      const truck=e.target.closest('[data-truck]');
      if(!truck||!canEdit()){e.preventDefault();return;}
      selectedTruckOperation=truck.dataset.truck;
      e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',selectedTruckOperation);
    });
    grid.addEventListener('dragover',e=>{
      const target=e.target.closest('[data-stage-target]');
      if(!canEdit()||!target||!selectedTruckOperation||target.dataset.stageOperation!==selectedTruckOperation)return;
      e.preventDefault();e.dataTransfer.dropEffect='move';target.classList.add('drag-over');
    });
    grid.addEventListener('dragleave',e=>{const cell=e.target.closest('[data-stage-target]');if(cell)cell.classList.remove('drag-over');});
    grid.addEventListener('drop',e=>{
      const cell=e.target.closest('[data-stage-target]');
      grid.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));
      if(!canEdit()||!cell||!selectedTruckOperation||cell.dataset.stageOperation!==selectedTruckOperation)return;
      e.preventDefault();
      const opId=selectedTruckOperation;selectedTruckOperation=null;
      promptStageMove(opId,Number(cell.dataset.stageTarget));
    });
    grid.addEventListener('dragend',()=>{selectedTruckOperation=null;grid.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));});
  }

  /* Midnight rollover: move today's badges into tomorrow's cells without reload. */
  function rolloverToday(){
    const next=iso(new Date());
    if(next===TODAY)return;
    TODAY=next;
    if(state.end<TODAY)state.end=addDays(TODAY,60);
    if(state.initialized){
      $('top-date').textContent=formatDate(TODAY,{day:'numeric',month:'long',year:'numeric'});
      renderAll(true);
    }
  }
/* Mobile-only calendar viewer with native fullscreen/orientation where permitted. */
  function isIOSDevice(){
    return /iPhone|iPad|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  }
  function isStandaloneWebApp(){
    return navigator.standalone===true||!!(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches);
  }
  function isMobileCalendarDevice(){
    const viewportWidth=Math.min(window.innerWidth,document.documentElement.clientWidth||window.innerWidth);
    const shortSide=Math.min(window.innerWidth,window.innerHeight)<=600;
    const coarse=!!(window.matchMedia&&window.matchMedia('(pointer:coarse)').matches);
    const touch=coarse||navigator.maxTouchPoints>0||'ontouchstart' in window;
    // iPhone landscape may request a desktop UA/layout. Height + touch wins.
    return shortSide&&(touch||viewportWidth<=760||isIOSDevice());
  }
  function showIOSStandaloneGuide(){
    if(document.getElementById('ios-standalone-guide'))return;
    const layer=document.createElement('div');
    layer.id='ios-standalone-guide';
    layer.className='modal-layer ios-standalone-guide';
    layer.innerHTML='<section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="ios-standalone-guide-title"><div class="modal-head"><h2 id="ios-standalone-guide-title">OSV без вкладок Safari</h2><button type="button" class="modal-close" data-ios-guide-close aria-label="Закрыть">×</button></div><p>Safari не позволяет веб-сайту скрыть адресную строку и вкладки. Откройте OSV как отдельное приложение:</p><ol><li>Откройте адрес <strong>sp-automation.com/OSV_impex_tracking/</strong> в Safari.</li><li>Нажмите <strong>«Поделиться»</strong> (квадрат со стрелкой вверх).</li><li>Выберите <strong>«На экран „Домой“»</strong> и включите <strong>«Открыть как веб-приложение»</strong>.</li><li>Нажмите <strong>«Добавить»</strong> и откройте OSV с нового значка.</li></ol><button type="button" class="btn btn-primary" data-ios-guide-close>Понятно</button></section>';
    layer.addEventListener('click',e=>{
      if(e.target===layer||e.target.closest('[data-ios-guide-close]'))layer.remove();
    });
    document.body.appendChild(layer);
  }
  function openMobileCalendar(){
    if(!isMobileCalendarDevice()||state.view!=='timeline')return;
    document.body.classList.add('mobile-calendar-mode');
    renderTimeline(false);

  }
  function closeMobileCalendar(){
    document.body.classList.remove('mobile-calendar-mode','calendar-immersive-mode');
    clearTimeout(pinchHintTimer);
    /* pinch hint removed */
    pinchGesture=null;
    applyMobileCalendarZoom(1);
    renderTimeline(true);

  }
  function setView(view){if(view!=='timeline'){resetStageZoom();resetDesktopCalendarZoom();}state.view=view;document.body.classList.toggle('timeline-mode',view==='timeline');(view==='timeline'?$('timeline-metrics-mount'):$('global-metrics-mount')).appendChild($('metrics'));(view==='timeline'?$('timeline-actions-mount'):$('intro-actions-mount')).appendChild($('new-operation-btn'));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));document.querySelectorAll('.view-pane').forEach(p=>p.classList.add('hidden'));$(view+'-view').classList.remove('hidden');const titles={timeline:['Таймлайн операций','Импорт и экспорт. От получения задания до финальной доставки.'],analytics:['Аналитика логистики','Скорость прохождения этапов и эффективность операций.'],archive:['Архив операций','История завершённых поставок и архивированные кейсы.'],audit:['Журнал изменений','История действий и корректировок по операциям.']};$('page-title').innerHTML=titles[view][0]+'<span class="title-dot">.</span>';$('page-subtitle').textContent=titles[view][1];$('breadcrumb-title').textContent=titles[view][0];if(view!=='timeline'&&document.body.classList.contains('mobile-calendar-mode'))closeMobileCalendar();}
  function openModal(id){$(id).classList.remove('hidden');document.body.style.overflow='hidden';}
  function closeModal(id){$(id).classList.add('hidden');if([...document.querySelectorAll('.modal-layer')].every(x=>x.classList.contains('hidden')))document.body.style.overflow='';}
  function toast(msg,error=false){const node=document.createElement('div');node.className='toast'+(error?' error':'');node.textContent=msg;$('toast-stack').append(node);setTimeout(()=>node.remove(),4300);}
  function showError(id,msg){const el=$(id);el.textContent=msg;el.classList.toggle('hidden',!msg);}
  function newOperation(){if(!requireEditor())return;const form=$('operation-form');form.reset();$('op-date').value=TODAY;showError('operation-error','');openModal('operation-modal');setTimeout(()=>$('op-company').focus(),40);}
  function existingEventsHtml(es){if(!es.length)return '';return '<div class="existing-heading">СОБЫТИЯ НА ВЫБРАННУЮ ДАТУ</div>'+es.map(e=>`<div class="existing-item"><span class="event-type-dot ${e.type}"></span><div class="existing-item-info"><strong>${esc(statusFor(e.status).label)}</strong><small>${e.type==='planned'?'План':'Факт'}${e.note?' · '+esc(e.note):''}</small></div>${canEdit()?`<button class="tiny-button" data-edit-event="${esc(e.id)}">Изм.</button><button class="tiny-button danger" data-delete-event="${esc(e.id)}">×</button>`:""}</div>`).join('');}
  function defaultEventType(status){return statusFor(status).allowed==='planned'?'planned':'actual';}
  function openEvent(operationId,date,editId=null){
    if(!requireEditor())return;
    const op=state.operations.find(o=>o.id===operationId);if(!op)return;
    state.activeOperation=operationId;state.activeDate=date;$('event-operation-caption').textContent=op.direction+' · '+op.company;$('event-modal-title').textContent=formatDate(date,{day:'numeric',month:'long',year:'numeric'});
    $('event-operation-id').value=operationId;$('event-edit-id').value=editId||'';$('event-date').value=date;$('event-note').value='';
    const statusSelect=$('event-status');
    statusSelect.innerHTML='<option value="" disabled>Выберите статус</option>'+STATUS.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');
    statusSelect.value='';
    document.querySelector('input[name="event-type"][value="actual"]').checked=true;
    const es=operationEvents(operationId).filter(e=>e.date===date);$('existing-events').innerHTML=existingEventsHtml(es);
    if(editId){
      const e=operationEvents(operationId).find(e=>e.id===editId);
      if(e){
        $('event-date').value=e.date;statusSelect.value=e.status;$('event-note').value=e.note||'';
        document.querySelector(`input[name="event-type"][value="${e.type}"]`).checked=true;
      }
    }
    $('event-submit').textContent=editId?'Обновить событие ↗':'Сохранить статус ↗';showError('event-error','');openModal('event-modal');
  }
  function openDrawer(id){const op=state.operations.find(o=>o.id===id);if(!op)return;state.activeOperation=id;const es=operationEvents(id),cycle=cycleDays(op),status=delivered(op)?'Завершена':correctOverdue(op)?'Есть отклонения':'В работе';
    $('drawer-content').innerHTML=`<h2 class="drawer-title">${esc(op.company)}</h2><p class="drawer-desc">${esc(op.goods)}</p><div class="drawer-identity"><span class="direction-tag ${op.direction.toLowerCase()}">${op.direction}</span><span class="info-pill">${status}</span></div><div class="drawer-stats"><div class="drawer-stat"><strong>${cycle!==null?cycle:'—'}</strong><small>Дней полного цикла</small></div><div class="drawer-stat"><strong>${es.length}</strong><small>Событий</small></div></div>${op.note?`<p style="font-size:12px;color:#a8b9ca;margin-top:18px">${esc(op.note)}</p>`:''}<div class="drawer-section-title">ХРОНОЛОГИЯ СОБЫТИЙ</div>${es.length?es.map(e=>`<div class="drawer-event"><div class="drawer-event-bullet ${e.type}"></div><div><strong>${esc(statusFor(e.status).label)}</strong><small>${esc(formatDate(e.date))} · ${e.type==='planned'?'План':'Факт'}</small>${e.note?`<p>${esc(e.note)}</p>`:''}</div></div>`).join(''):'<p>Пока нет событий</p>'}${canEdit()?`<div class="drawer-buttons"><button class="btn btn-primary" id="drawer-add-event">+ Событие</button><button class="btn btn-outline" id="drawer-archive">${op.archived?'Вернуть из архива':'В архив'}</button></div>`:""}`;
    $('drawer-backdrop').classList.remove('hidden');$('detail-drawer').classList.remove('hidden');document.body.style.overflow='hidden';
    if(!canEdit())return;
    $('drawer-add-event').onclick=()=>{closeDrawer();openEvent(id,TODAY);};
    $('drawer-archive').onclick=()=>{if(!confirm(op.archived?'Вернуть операцию из архива?':'Переместить операцию в архив?'))return;const button=$('drawer-archive');guarded(async()=>{await backendCall('apiArchiveOperation',id,!op.archived);closeDrawer();toast(op.archived?'Операция восстановлена':'Операция архивирована');},button);};
  }
  function closeDrawer(){$('drawer-backdrop').classList.add('hidden');$('detail-drawer').classList.add('hidden');document.body.style.overflow='';}
  /* Excel OOXML export with a dependency-free ZIP (stored files + CRC32).
     No CSV fallback, network library, macros, or intermediate server. */
  function xlsxExport(){
    const ops=state.operations.filter(o=>!o.archived);
    const isOverdue=o=>correctOverdue(o);
    const summary=[
      ['Показатель','Значение'],
      ['Дата формирования',TODAY],
      ['Операций',ops.length],
      ['Активные',ops.filter(o=>!delivered(o)).length],
      ['Завершены',ops.filter(delivered).length],
      ['С отклонениями',ops.filter(isOverdue).length],
      ['Средний цикл (дней)',fmtMetric(avg(ops.filter(delivered).map(cycleDays).filter(n=>n!==null)))],
      ['Источник','OSV IMPEX Tracking']
    ];
    const operationRows=[['ID','Направление','Компания','Товар','Дата задания','Состояние','Просрочка','Дней полного цикла','Комментарий']];
    ops.forEach(op=>operationRows.push([op.id,op.direction,op.company,op.goods,op.createdAt,delivered(op)?'Завершена':'В работе',isOverdue(op)?'Да':'Нет',cycleDays(op)??'',op.note||'']));
    const eventRows=[['ID события','ID операции','Направление','Компания','Товар','Дата события','Этап','Тип','Комментарий']];
    ops.forEach(op=>operationEvents(op.id).forEach(ev=>eventRows.push([ev.id,op.id,op.direction,op.company,op.goods,ev.date,statusFor(ev.status).label,ev.type==='actual'?'Факт':'План',ev.note||''])));
    const sheets=[
      {name:'Сводка',widths:[31,30],rows:summary},
      {name:'Операции',widths:[41,16,32,34,18,19,17,23,55],rows:operationRows},
      {name:'События',widths:[41,41,16,32,34,18,38,16,55],rows:eventRows}
    ];
    const xmlEsc=v=>String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
    const colName=i=>{let s='';for(i++;i;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s;};
    const worksheet=sh=>{
      const columns=sh.widths.map((w,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>').join('');
      const rows=sh.rows.map((row,i)=>'<row r="'+(i+1)+'">'+row.map((value,j)=>{
        const cell=' r="'+colName(j)+(i+1)+'"'+(i===0?' s="1"':'');
        return typeof value==='number'&&Number.isFinite(value)?'<c'+cell+'><v>'+value+'</v></c>':'<c'+cell+' t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(value)+'</t></is></c>';
      }).join('')+'</row>').join('');
      const last=colName(sh.widths.length-1)+sh.rows.length;
      return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'+
        '<sheetFormatPr defaultRowHeight="16"/><cols>'+columns+'</cols><sheetData>'+rows+'</sheetData>'+
        '<autoFilter ref="A1:'+last+'"/></worksheet>';
    };
    const xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    const book=xml+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+
      sheets.map((sh,i)=>'<sheet name="'+xmlEsc(sh.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets></workbook>';
    const rels=xml+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+
      sheets.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+
      '<Relationship Id="rId'+(sheets.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    const styles=xml+'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
      '<fonts count="2"><font><sz val="11"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font></fonts>'+
      '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFAE1828"/><bgColor indexed="64"/></patternFill></fill></fills>'+
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'+
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'+
      '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>'+
      '</styleSheet>';
    const types=xml+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'+
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'+
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+
      sheets.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>';
    const files=[
      ['[Content_Types].xml',types],
      ['_rels/.rels',xml+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
      ['xl/workbook.xml',book],['xl/_rels/workbook.xml.rels',rels],['xl/styles.xml',styles],
      ...sheets.map((sh,i)=>['xl/worksheets/sheet'+(i+1)+'.xml',worksheet(sh)])
    ];
    const enc=new TextEncoder(),chunks=[],central=[];let offset=0;
    const put16=(view,pos,n)=>view.setUint16(pos,n,true),put32=(view,pos,n)=>view.setUint32(pos,n>>>0,true);
    const crc32=data=>{let crc=0xffffffff;for(const byte of data){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;};
    files.forEach(([filename,contents])=>{
      const name=enc.encode(filename),data=enc.encode(contents),crc=crc32(data);
      const local=new Uint8Array(30+name.length),lv=new DataView(local.buffer);
      put32(lv,0,0x04034b50);put16(lv,4,20);put16(lv,6,0x0800);put16(lv,8,0);
      put32(lv,14,crc);put32(lv,18,data.length);put32(lv,22,data.length);put16(lv,26,name.length);
      local.set(name,30);chunks.push(local,data);
      const cd=new Uint8Array(46+name.length),cv=new DataView(cd.buffer);
      put32(cv,0,0x02014b50);put16(cv,4,20);put16(cv,6,20);put16(cv,8,0x0800);put16(cv,10,0);
      put32(cv,16,crc);put32(cv,20,data.length);put32(cv,24,data.length);put16(cv,28,name.length);
      put32(cv,42,offset);cd.set(name,46);central.push(cd);offset+=local.length+data.length;
    });
    const centralSize=central.reduce((sum,item)=>sum+item.length,0);
    const end=new Uint8Array(22),endView=new DataView(end.buffer);
    put32(endView,0,0x06054b50);put16(endView,8,files.length);put16(endView,10,files.length);
    put32(endView,12,centralSize);put32(endView,16,offset);
    const blob=new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url=URL.createObjectURL(blob),anchor=document.createElement('a');
    anchor.href=url;anchor.download='OSV_IMPEX_'+TODAY+'.xlsx';document.body.appendChild(anchor);
    anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    toast('Excel-файл .xlsx подготовлен');
  }
  /* Mobile row gestures:
     2 taps on the same shipment row = open full operation details and chronology.
     3 taps on the same date cell = open that date's event editor.
     Delay the double-tap action until the third-tap window closes, so double
     cannot swallow triple. Cancel on scrolling, pinch, movement and long holds.
     Desktop double-click editing remains separate. */
  let lastMobileCellOpen=0;
  function installCalendarDoubleTap(){
    const scroller=$('timeline-scroller');
    const WINDOW=440, MOVE_TOLERANCE=13, MAX_HOLD=500;
    let finger=null,sequence=null,pendingAction=0;
    const clearPending=()=>{if(pendingAction){clearTimeout(pendingAction);pendingAction=0;}};
    const clearSequence=()=>{clearPending();sequence=null;};
    const cancel=()=>{finger=null;clearSequence();};
    scroller.addEventListener('touchstart',e=>{
      if(e.touches.length!==1){cancel();return;}
      const row=e.target.closest('.timeline-row[data-row-op]');
      if(!row||e.target.closest('button,a,input,textarea,select')){finger=null;return;}
      const t=e.touches[0];
      finger={op:row.dataset.rowOp,cell:e.target.closest('.day-slot'),x:t.clientX,y:t.clientY,time:Date.now()};
    },{passive:true});
    scroller.addEventListener('touchmove',e=>{
      if(!finger)return;
      if(e.touches.length!==1){cancel();return;}
      const t=e.touches[0];
      if(Math.hypot(t.clientX-finger.x,t.clientY-finger.y)>MOVE_TOLERANCE)cancel();
    },{passive:true});
    scroller.addEventListener('touchend',e=>{
      const tap=finger;finger=null;
      if(!tap||e.touches.length!==0||e.changedTouches.length!==1||Date.now()-tap.time>MAX_HOLD)return;
      const now=Date.now(),matches=sequence&&sequence.op===tap.op&&now-sequence.lastTime<=WINDOW;
      if(!matches){
        clearSequence();
        sequence={op:tap.op,firstCell:tap.cell,secondCell:null,count:1,lastTime:now};
        return;
      }
      if(sequence.count===1){
        // Confirm two taps; give the user a short window for the third tap.
        sequence.count=2;sequence.secondCell=tap.cell;sequence.lastTime=now;
        e.preventDefault();
        lastMobileCellOpen=now;
        clearPending();
        pendingAction=setTimeout(()=>{
          pendingAction=0;
          if(!sequence||sequence.count!==2)return;
          const op=sequence.op;
          sequence=null;
          openDrawer(op);
        },WINDOW);
        return;
      }
      if(sequence.count===2){
        e.preventDefault();
        lastMobileCellOpen=now;
        const sameCell=!!(tap.cell&&tap.cell===sequence.firstCell&&tap.cell===sequence.secondCell);
        const op=sequence.op,date=sameCell?tap.cell.dataset.date:null;
        clearSequence();
        if(sameCell&&date)openEvent(op,date);
        else openDrawer(op);
      }
    },{passive:false});
    scroller.addEventListener('touchcancel',cancel,{passive:true});
    scroller.addEventListener('scroll',()=>{if(finger||sequence)cancel();},{passive:true});
  }
  /* Desktop: move the timeline with a held left mouse button, in both axes.
     A short click remains a click; double-click edits only when no dragging occurred.
     Touch/pinch gestures and all buttons keep their existing behavior. */
  function installDesktopCalendarDrag(){
    const scroller=$('timeline-scroller');
    let drag=null,ignoreNextClick=false,ignoreNextDoubleClick=false;
    const finish=()=>{
      if(!drag)return;
      const moved=drag.moved;
      const pointerId=drag.pointerId;
      drag=null;
      scroller.classList.remove('is-dragging');
      if(scroller.hasPointerCapture&&scroller.hasPointerCapture(pointerId)){
        try{scroller.releasePointerCapture(pointerId);}catch{}
      }
      if(moved){
        ignoreNextClick=true;
        ignoreNextDoubleClick=true;
        setTimeout(()=>{ignoreNextClick=false;},0);
        setTimeout(()=>{ignoreNextDoubleClick=false;},300);
      }
    };
    scroller.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0||e.isPrimary===false||document.body.classList.contains('mobile-calendar-mode'))return;
      if(e.target.closest('button,a,input,select,textarea,[contenteditable="true"]'))return;
      drag={pointerId:e.pointerId,x:e.clientX,y:e.clientY,left:scroller.scrollLeft,top:scroller.scrollTop,moved:false};
    });
    window.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.pointerId)return;
      if((e.buttons&1)===0){finish();return;}
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!drag.moved&&Math.hypot(dx,dy)<5)return;
      if(!drag.moved){
        drag.moved=true;
        scroller.classList.add('is-dragging');
        if(scroller.setPointerCapture){try{scroller.setPointerCapture(e.pointerId);}catch{}}
      }
      e.preventDefault();
      scroller.scrollLeft=drag.left-dx;
      scroller.scrollTop=drag.top-dy;
    },{passive:false});
    window.addEventListener('pointerup',e=>{if(drag&&e.pointerId===drag.pointerId)finish();});
    window.addEventListener('pointercancel',e=>{if(drag&&e.pointerId===drag.pointerId)finish();});
    window.addEventListener('blur',finish);
    scroller.addEventListener('dragstart',e=>{if(drag)e.preventDefault();});
    scroller.addEventListener('click',e=>{
      if(!ignoreNextClick)return;
      ignoreNextClick=false;
      e.preventDefault();
      e.stopImmediatePropagation();
    },true);
    scroller.addEventListener('dblclick',e=>{
      if(!ignoreNextDoubleClick)return;
      ignoreNextDoubleClick=false;
      e.preventDefault();
      e.stopImmediatePropagation();
    },true);
  }
  async function refreshDataManually(){
    if(state.isLoading)return;
    const button=$('refresh-data-btn');
    state.isLoading=true;
    button.disabled=true;
    button.classList.add('is-loading');
    button.setAttribute('aria-busy','true');
    try{
      if(IS_GAS)await reloadFromBackend();
      else Object.assign(state,loadDemo());
      renderAll(true);
      const at=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
      button.title='Обновлено в '+at;
      toast('Данные обновлены · '+at);
    }catch(err){
      toast('Ошибка обновления: '+(err?.message||String(err)),true);
    }finally{
      button.classList.remove('is-loading');
      button.removeAttribute('aria-busy');
      button.disabled=false;
      state.isLoading=false;
    }
  }

  /* Desktop zoom scales real calendar cells, not the browser viewport.
     Positive zoom opens an application-owned focus overlay (never browser fullscreen). */
  const DESKTOP_ZOOM_MIN=0.70,DESKTOP_ZOOM_MAX=1.60,DESKTOP_ZOOM_STEP=0.15;
  let desktopCalendarZoom=1;
  function isDesktopCalendar(){
    return window.matchMedia('(min-width:1000px) and (hover:hover) and (pointer:fine)').matches
      && !document.body.classList.contains('mobile-calendar-mode');
  }
  function updateDesktopZoomControls(){
    const percent=Math.round(desktopCalendarZoom*100);
    $('desktop-calendar-scale').textContent=percent+'%';
    $('desktop-calendar-minus').disabled=desktopCalendarZoom<=DESKTOP_ZOOM_MIN+0.001;
    $('desktop-calendar-plus').disabled=desktopCalendarZoom>=DESKTOP_ZOOM_MAX-0.001;
    $('desktop-calendar-close').hidden=!document.body.classList.contains('calendar-zoom-overlay');
  }
  function setDesktopOverlay(active){
    const backdrop=$('calendar-zoom-backdrop');
    if(active&&!isDesktopCalendar())return;
    const already=document.body.classList.contains('calendar-zoom-overlay');
    if(active===already)return;
    if(active){
      backdrop.hidden=false;
      document.body.classList.add('calendar-zoom-overlay');
      requestAnimationFrame(()=>backdrop.classList.add('is-active'));
    }else{
      backdrop.classList.remove('is-active');
      document.body.classList.remove('calendar-zoom-overlay');
      setTimeout(()=>{if(!backdrop.classList.contains('is-active'))backdrop.hidden=true;},260);
    }
    updateDesktopZoomControls();
  }
  function changeDesktopCalendarZoom(direction){
    if(!isDesktopCalendar())return;
    const next=Math.round(Math.max(DESKTOP_ZOOM_MIN,Math.min(DESKTOP_ZOOM_MAX,desktopCalendarZoom+direction*DESKTOP_ZOOM_STEP))*100)/100;
    if(next===desktopCalendarZoom)return;
    const scroller=$('timeline-scroller');
    const label=timelineLabelWidth(),oldW=dayWidth();
    const oldRow=76*desktopCalendarZoom;
    const centerDate=(scroller.scrollLeft+scroller.clientWidth/2-label)/oldW;
    const centerRow=(scroller.scrollTop+scroller.clientHeight/2)/oldRow;
    desktopCalendarZoom=next;
    const panel=$('timeline-view').querySelector('.timeline-panel');
    panel.style.setProperty('--day-width',(79*next).toFixed(2)+'px');
    panel.style.setProperty('--desktop-row-height',(76*next).toFixed(2)+'px');
    setDesktopOverlay(next>1.001);
    requestAnimationFrame(()=>{
      const newW=dayWidth(),newRow=76*next;
      scroller.scrollLeft=Math.max(0,label+centerDate*newW-scroller.clientWidth/2);
      scroller.scrollTop=Math.max(0,centerRow*newRow-scroller.clientHeight/2);
      positionTimelineWatermarks();
    });
    updateDesktopZoomControls();
  }
  function resetDesktopCalendarZoom(){
    if(!document.body.classList.contains('calendar-zoom-overlay')&&desktopCalendarZoom===1)return;
    const scroller=$('timeline-scroller');
    const date=(scroller.scrollLeft+scroller.clientWidth/2-timelineLabelWidth())/dayWidth();
    desktopCalendarZoom=1;
    const panel=$('timeline-view').querySelector('.timeline-panel');
    panel.style.removeProperty('--day-width');
    panel.style.removeProperty('--desktop-row-height');
    setDesktopOverlay(false);
    requestAnimationFrame(()=>{
      scroller.scrollLeft=Math.max(0,timelineLabelWidth()+date*dayWidth()-scroller.clientWidth/2);
      positionTimelineWatermarks();
    });
    updateDesktopZoomControls();
  }

  function attachEvents(){
    setInterval(rolloverToday,30000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)rolloverToday();});
    window.addEventListener('focus',rolloverToday);
    installTimelinePinch();
    installCalendarDoubleTap();
    installDesktopCalendarDrag();
    installStageInteractions();
    $('desktop-calendar-minus').addEventListener('click',()=>changeDesktopCalendarZoom(-1));
    $('desktop-calendar-plus').addEventListener('click',()=>changeDesktopCalendarZoom(1));
    $('desktop-calendar-close').addEventListener('click',resetDesktopCalendarZoom);
    $('calendar-zoom-backdrop').addEventListener('click',()=>{resetStageZoom();resetDesktopCalendarZoom();});
    updateDesktopZoomControls();
    window.addEventListener('resize',()=>{if(!isDesktopCalendar())resetDesktopCalendarZoom();});
    $('refresh-data-btn').addEventListener('click',refreshDataManually);
    $('mobile-calendar-open').addEventListener('click',openMobileCalendar);
    $('mobile-calendar-back').addEventListener('click',closeMobileCalendar);
    window.addEventListener('resize',()=>{
      if(document.body.classList.contains('mobile-calendar-mode')&&!isMobileCalendarDevice())closeMobileCalendar();
    });
    document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
    $('new-operation-btn').addEventListener('click',newOperation);
    $('search-input').addEventListener('input',e=>{state.query=e.target.value;renderMetrics();renderTimeline(true);});
    $('direction-filter').addEventListener('change',e=>{state.direction=e.target.value;renderMetrics();renderTimeline(true);});
    $('state-filter').addEventListener('change',e=>{state.filter=e.target.value;renderMetrics();renderTimeline(true);});
    $('metrics').addEventListener('click',e=>{const btn=e.target.closest('[data-metric-filter]');if(btn)setMetricFilter(btn.dataset.metricFilter);});
    $('clear-filter-btn').addEventListener('click',clearAllTimelineFilters);
    $('today-btn').addEventListener('click',()=>scrollToDate(TODAY));
    $('prev-week').addEventListener('click',()=>shiftWeek(-1));$('next-week').addEventListener('click',()=>shiftWeek(1));
    $('export-btn').addEventListener('click',xlsxExport);
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
    document.querySelectorAll('.modal-layer').forEach(el=>el.addEventListener('click',e=>{if(e.target===el)closeModal(el.id);}));
    $('close-drawer').addEventListener('click',closeDrawer);$('drawer-backdrop').addEventListener('click',closeDrawer);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){resetStageZoom();resetDesktopCalendarZoom();document.querySelectorAll('.modal-layer:not(.hidden)').forEach(el=>closeModal(el.id));closeDrawer();}});
    // Opening a status is an intentional double action, never a single scroll/tap.
    document.addEventListener('dblclick',e=>{
      const slot=e.target.closest('.day-slot');
      if(!slot||isMobileCalendarDevice()||Date.now()-lastMobileCellOpen<900)return;
      e.preventDefault();
      openEvent(slot.dataset.op,slot.dataset.date);
    });
    document.addEventListener('click',e=>{
      const op=e.target.closest('[data-open-op]');if(op){if(isMobileCalendarDevice()&&op.closest('.timeline-row'))return;openDrawer(op.dataset.openOp);return;}
      const edit=e.target.closest('[data-edit-event]');if(edit){if(!requireEditor())return;openEvent(state.activeOperation,state.activeDate,edit.dataset.editEvent);return;}
      const del=e.target.closest('[data-delete-event]');if(del){if(!requireEditor())return;const id=del.dataset.deleteEvent,opid=state.activeOperation,date=state.activeDate;if(!confirm('Удалить событие? История изменения сохранится в журнале.'))return;guarded(async()=>{await backendCall('apiDeleteEvent',opid,id);closeModal('event-modal');toast('Событие удалено');});}
    });
    $('event-status').addEventListener('change',e=>{document.querySelector(`input[name="event-type"][value="${defaultEventType(e.target.value)}"]`).checked=true;});
    $('operation-form').addEventListener('submit',e=>{e.preventDefault();if(!requireEditor())return;const form=e.currentTarget,btn=form.querySelector('button[type=submit]');const fd=new FormData(form);const p={direction:fd.get('direction'),company:String(fd.get('company')||'').trim(),goods:String(fd.get('goods')||'').trim(),date:String(fd.get('date')||''),note:String(fd.get('note')||'').trim()};if(!p.company||!p.goods||!/\d{4}-\d{2}-\d{2}/.test(p.date)){showError('operation-error','Заполните обязательные поля');return;}guarded(async()=>{await backendCall('apiCreateOperation',p);closeModal('operation-modal');toast('Операция создана');},btn);});
    $('event-form').addEventListener('submit',e=>{e.preventDefault();if(!requireEditor())return;const btn=$('event-submit');const operationId=$('event-operation-id').value, p={id:$('event-edit-id').value||'',date:$('event-date').value,status:$('event-status').value,type:document.querySelector('input[name="event-type"]:checked').value,note:$('event-note').value.trim()};if(!p.date||!BY_STATUS[p.status]){showError('event-error','Выберите статус и укажите дату события');$('event-status').focus();return;}guarded(async()=>{await backendCall('apiSaveEvent',operationId,p);closeModal('event-modal');toast(p.id?'Событие обновлено':'Событие сохранено');},btn);});
    $('timeline-scroller').addEventListener('scroll',()=>{
      positionTimelineWatermarks();
      const s=$('timeline-scroller');if(s.scrollLeft+s.clientWidth>s.scrollWidth-dayWidth()*14&&state.end<addDays(TODAY,700)){
        const x=s.scrollLeft,y=s.scrollTop;state.end=addDays(state.end,70);renderTimeline(true);requestAnimationFrame(()=>{s.scrollLeft=x;s.scrollTop=y;});
      }
    },{passive:true});
    $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;showError('login-error','');try{const result=await gasCall('apiLogin',$('login-password').value);if(!result?.token)throw Error('Сервер не выдал сессию');state.token=result.token;state.role=result.role||'editor';try{sessionStorage.setItem(SESSION_KEY,result.token);}catch{}await startWorkspace();}catch(err){showError('login-error',err?.message||'Ошибка авторизации');}finally{btn.disabled=false;}});
    $('logout-btn').addEventListener('click',async()=>{try{await gasCall('apiLogout',state.token);}catch{}state.token=null;state.role='editor';try{sessionStorage.removeItem(SESSION_KEY);}catch{}$('workspace').classList.add('hidden');$('login').classList.remove('hidden');});
  }
  async function startWorkspace(){
    if(IS_GAS){const raw=await gasCall('apiBootstrap',state.token);Object.assign(state,normalized(raw));state.role=raw.role||'editor';$('environment-badge').classList.add('live');$('environment-badge').innerHTML='<i></i> LIVE';const connectionLabel=$('connection-label');if(connectionLabel)connectionLabel.textContent='Google Sheets · Online';$('logout-btn').hidden=false;}
    else{Object.assign(state,loadDemo());state.role='editor';$('environment-badge').innerHTML='<i></i> ДЕМО';}
    const first=state.events.map(e=>e.date).sort()[0];if(first&&first<state.start)state.start=addDays(first,-12);
    const last=state.events.map(e=>e.date).sort().at(-1);if(last&&last>state.end)state.end=addDays(last,50);
    $('login').classList.add('hidden');$('workspace').classList.remove('hidden');
    $('top-date').textContent=formatDate(TODAY,{day:'numeric',month:'long',year:'numeric'});
    applyRole();renderAll();setView(state.view);state.initialized=true;
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

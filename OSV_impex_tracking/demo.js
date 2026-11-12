(() => {
'use strict';
const $=id=>document.getElementById(id);
const qa=s=>Array.from(document.querySelectorAll(s));
const records=[
 {name:'Демо Импорт · Электрооборудование',company:'Компания А',direction:'Импорт',status:'active',date:0,events:[['Заявка',0,''],['ТС найден',2,'transport'],['Таможня',3,'customs']]},
 {name:'Демо Экспорт · Упаковка',company:'Компания Б',direction:'Экспорт',status:'active',date:1,events:[['Заявка',1,''],['Загружен',3,'transport'],['В пути',4,'']]},
 {name:'Демо Импорт · Сырьё',company:'Компания В',direction:'Импорт',status:'done',date:0,events:[['Заявка',0,''],['Оформлено',3,'customs'],['Доставлено',5,'done']]},
 {name:'Демо Экспорт · Детали',company:'Компания Г',direction:'Экспорт',status:'active',date:2,events:[['Заявка',2,''],['ТС найден',4,'transport']]},
 {name:'Демо Импорт · Запчасти',company:'Компания Д',direction:'Импорт',status:'done',date:0,events:[['Заявка',0,''],['Оформлено',2,'customs'],['Доставлено',4,'done']]}
];
let tab='timeline',index=0,auto=false,playTimer=null,active=false,mode='manual';
const names={timeline:['Таймлайн','Таймлайн операций','Демонстрационные операции и статусы. Настоящих данных здесь нет.'],analytics:['Аналитика','Аналитика','Обзор эффективности и сроков'],archive:['Архив','Архив','Завершённые операции'],audit:['Журнал','Журнал изменений','Хронология действий пользователей'],mail:['Email-рассылки','Email-рассылки','Матрица уведомлений по событиям']};
function renderTable(){
 const q=$('filter-search').value.toLowerCase().trim(),direction=$('filter-direction').value,status=$('filter-state').value;
 const list=records.filter(r=>(direction==='all'||r.direction===direction)&&(status==='all'||r.status===status)&&(!q||(r.name+' '+r.company).toLowerCase().includes(q)));
 $('operations-body').innerHTML=list.length?list.map(r=>{
 const cells=Array.from({length:7},(_,i)=>{
  const e=r.events.find(x=>x[1]===i);
  return '<td'+(i===3?' class="today-col"':'')+'>'+(e?'<span class="event-pill '+e[2]+'" title="Демонстрационное событие">'+e[0]+'</span>':'')+'</td>';
 }).join('');
 return '<tr><td><strong>'+r.name+'</strong><small>'+r.company+' · '+r.direction+'</small></td>'+cells+'</tr>';
 }).join(''):'<tr><td colspan="8">Нет операций по выбранным фильтрам</td></tr>';
 qa('.event-pill').forEach(el=>el.addEventListener('click',()=>el.classList.add('training-flash')));
}
function switchTab(next){
 if(!names[next])return;
 tab=next;
 qa('.view').forEach(el=>el.classList.toggle('hidden',el.id!=='view-'+next));
 qa('.nav-item').forEach(el=>el.classList.toggle('is-current',el.dataset.tab===next));
 $('breadcrumb').textContent=names[next][1];$('page-heading').innerHTML=names[next][0]+' <i>.</i>';$('page-description').textContent=names[next][2];
}
qa('.nav-item').forEach(el=>el.addEventListener('click',()=>{switchTab(el.dataset.tab);if(active&&!auto)alignTour();}));
qa('.filters input,.filters select').forEach(el=>el.addEventListener('input',renderTable));
$('filter-reset').addEventListener('click',()=>{$('filter-search').value='';$('filter-direction').value='all';$('filter-state').value='all';renderTable()});
$('today-action').addEventListener('click',()=>{$('today-action').classList.add('training-flash');setTimeout(()=>$('today-action').classList.remove('training-flash'),500)});
$('zoom-action').addEventListener('click',()=>{$('zoom-action').classList.toggle('training-flash')});
qa('[data-kpi]').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.kpi==='active'||el.dataset.kpi==='done'){$('filter-state').value=el.dataset.kpi;switchTab('timeline');renderTable()}else switchTab('analytics')}));
$('archive-list').innerHTML=['Демо Импорт · Сырьё','Демо Импорт · Запчасти','Демо Экспорт · Готовая продукция'].map((x,i)=>'<div><b>'+x+'</b><span>Доставлено · '+(8+i)+'.11.2026</span></div>').join('');
const steps=[
 {tab:'timeline',sel:'.nav-item[data-tab="timeline"]',title:'Главная навигация',text:'В левой панели находятся основные разделы портала. Начнём с календаря операций.'},
 {tab:'timeline',sel:'.kpi[data-kpi="active"]',title:'Активные операции',text:'Карточки KPI работают как быстрые фильтры. Здесь показано число текущих операций.',act:()=>{$('filter-state').value='active';renderTable();}},
 {tab:'timeline',sel:'#filter-direction',title:'Фильтр направления',text:'Можно быстро отделить импорт от экспорта. Сейчас оставим только импорт.',act:()=>{$('filter-direction').value='Импорт';renderTable();}},
 {tab:'timeline',sel:'#filter-search',title:'Поиск по операциям',text:'Введите компанию или название груза, чтобы мгновенно сузить список.',act:()=>{$('filter-search').value='Компания А';renderTable();}},
 {tab:'timeline',sel:'.timeline-table',title:'События календаря',text:'Каждая строка — операция. Цветные метки обозначают фактические этапы; здесь используются только учебные события.'},
 {tab:'timeline',sel:'#filter-reset',title:'Сброс фильтров',text:'Одним нажатием возвращаем все операции.',act:()=>{$('filter-reset').click()}},
 {tab:'analytics',sel:'.nav-item[data-tab="analytics"]',title:'Раздел аналитики',text:'Переходим к аналитике: здесь показатели и графики помогают оценить прохождение операций.'},
 {tab:'analytics',sel:'#analytics-period',title:'Период анализа',text:'Этот переключатель меняет временной период. В демо графики показывают условные значения.',act:()=>{$('analytics-period').value='Ноябрь';}},
 {tab:'archive',sel:'#archive-list',title:'Архив операций',text:'Завершённые операции сохраняются в архиве, где их можно найти и просмотреть.'},
 {tab:'audit',sel:'.audit-list',title:'Журнал действий',text:'Журнал показывает историю изменений и даты событий. В демо это вымышленные записи.'},
 {tab:'mail',sel:'.mail-table',title:'Матрица рассылок',text:'На этой вкладке видно, кто получает уведомления по этапам. Для режима VIEW ONLY настройки недоступны.'},
 {tab:'timeline',sel:'#tour-restart',title:'Обучение завершено',text:'Вы посмотрели основные функции. Можете пройти тур снова или самостоятельно изучить демо.'}
];
function stopTimer(){if(playTimer){clearTimeout(playTimer);playTimer=null;}}
function clean(){stopTimer();active=false;auto=false;$('tour-shade').classList.add('hidden');$('tour-highlight').classList.add('hidden');$('tour-cursor').classList.add('hidden');$('tour-card').classList.add('hidden');}
function alignTour(){
 if(!active)return;
 const step=steps[index],el=document.querySelector(step.sel);if(!el)return;
 const r=el.getBoundingClientRect(),highlight=$('tour-highlight'),cursor=$('tour-cursor');
 highlight.style.top=Math.max(4,r.top)+'px';highlight.style.left=Math.max(4,r.left)+'px';highlight.style.width=Math.min(r.width,innerWidth-8)+'px';highlight.style.height=Math.min(r.height,innerHeight-8)+'px';
 const x=Math.min(innerWidth-48,Math.max(8,r.left+Math.min(r.width*.52,170)));
 const y=Math.min(innerHeight-55,Math.max(8,r.top+Math.min(r.height*.45,45)));
 cursor.style.transform='translate('+x+'px,'+y+'px)';
}
function renderStep(){
 stopTimer();active=true;
 const s=steps[index];switchTab(s.tab);$('tour-welcome').classList.add('hidden');
 $('tour-shade').classList.remove('hidden');$('tour-highlight').classList.remove('hidden');$('tour-cursor').classList.remove('hidden');$('tour-card').classList.remove('hidden');
 $('tour-progress').textContent=(index+1)+' / '+steps.length;$('tour-title').textContent=s.title;$('tour-text').textContent=s.text;
 $('tour-back').disabled=index===0;$('tour-next').textContent=index===steps.length-1?'Готово ✓':'Далее →';$('tour-play').textContent=auto?'⏸ Пауза':'▶ Показ';
 const el=document.querySelector(s.sel);if(el){el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});}
 requestAnimationFrame(()=>setTimeout(()=>{
  if(!active)return;alignTour();$('tour-cursor').classList.add('clicking');setTimeout(()=>$('tour-cursor').classList.remove('clicking'),500);
  if(s.act)s.act();
  if(auto)playTimer=setTimeout(nextStep,5300);
 },850));
}
function nextStep(){if(index===steps.length-1){clean();$('tour-welcome').classList.remove('hidden');return}index++;renderStep()}
function start(automatic){mode=automatic?'auto':'manual';auto=automatic;index=0;$('filter-search').value='';$('filter-direction').value='all';$('filter-state').value='all';$('analytics-period').value='Все месяцы';renderTable();renderStep()}
$('tour-next').addEventListener('click',nextStep);
$('tour-back').addEventListener('click',()=>{if(index>0){index--;renderStep()}});
$('tour-play').addEventListener('click',()=>{auto=!auto;$('tour-play').textContent=auto?'⏸ Пауза':'▶ Показ';stopTimer();if(auto)playTimer=setTimeout(nextStep,5300)});
$('tour-stop').addEventListener('click',clean);
$('tour-restart').addEventListener('click',()=>start(true));
$('start-auto').addEventListener('click',()=>start(true));
$('start-manual').addEventListener('click',()=>start(false));
$('explore-demo').addEventListener('click',()=>{$('tour-welcome').classList.add('hidden');clean()});
addEventListener('resize',alignTour);addEventListener('scroll',alignTour,{passive:true,capture:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)clean();if(e.key==='ArrowRight'&&active)nextStep()});
renderTable();
})();
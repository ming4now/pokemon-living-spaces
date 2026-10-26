'use strict';
(() => {
 const root = document.getElementById('design-gallery');
 let renderedRoom = null, renderedItem = null;
 const items = room => window.FURNITURE_CATALOG?.[room.id] || [];
 const route = (room, view, item) => '#' + new URLSearchParams({room:room.id, ...(view !== 'model' ? {view:'concept'} : {}), ...(item ? {item:item.id} : {})});
 const el = (tag, className, text) => {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text) n.textContent = text;
  return n;
 };
 function link(text, href, className = 'design-action') {
  const n = el('a', className, text); n.href = href; return n;
 }
 function photo(item, lazy = true) {
  const box = el('div', 'product-image');
  if (!item.image) {
   box.append(el('span', 'image-pending', '高清概念图暂未生成'));
   return box;
  }
  const img = el('img'); img.src = item.image; img.alt = item.name + ' · 独立高清概念图';
  img.width = item.width; img.height = item.height; img.loading = lazy ? 'lazy' : 'eager'; img.decoding = 'async';
  img.addEventListener('error', () => box.replaceChildren(el('span', 'image-pending', '图片暂未加载，请刷新重试')));
  box.append(img); return box;
 }
 function imageDialog(src, title) {
  const dialog = el('dialog', 'art-lightbox'); dialog.setAttribute('aria-label', title);
  const bar = el('div', 'lightbox-bar'); bar.append(el('strong', '', title));
  const close = el('button', 'design-action', '关闭 ×'); close.type = 'button';
  bar.append(close);
  const image = el('img'); image.src = src; image.alt = title;
  dialog.append(bar, image); document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => dialog.remove(), {once:true});
  dialog.addEventListener('keydown', e => { if(e.key === 'Escape') e.stopPropagation(); });
  dialog.showModal();
 }
 function heading(room, title, subtitle) {
  const header = el('header', 'design-heading');
  const text = el('div'); text.append(el('p', 'eyebrow', room.english + ' / DESIGN COLLECTION'), el('h1', '', title), el('p', 'intro', subtitle));
  header.append(text); return header;
 }
 function jumpTo(section) {
  section.scrollIntoView({block:'start'});
  const title=section.querySelector('h2,h3');
  if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
 }
 function sectionHeading(number, title, subtitle, id) {
  const header=el('header','concept-section-heading'), text=el('div');
  const titleEl=el('h2','',title);titleEl.id=id;
  text.append(el('p','eyebrow',number),titleEl);
  if(subtitle)text.append(el('p','intro',subtitle));
  header.append(text);return header;
 }
 function scene(room) {
  const section=el('section','concept-scene-section');section.setAttribute('aria-labelledby','scene-title');
  section.append(sectionHeading('01 / SPACE','场景概念',null,'scene-title'));
  const button = el('button', 'scene-concept'); button.type = 'button'; button.setAttribute('aria-label', '放大查看' + room.title + '完整设计板');
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), image = document.createElementNS(ns, 'image');
  const crop = room.concept.crop, clipId = 'scene-crop-' + room.id;
  const defs = document.createElementNS(ns, 'defs'), clip = document.createElementNS(ns, 'clipPath'), rect = document.createElementNS(ns, 'rect');
  clip.id = clipId; ['x','y','width','height'].forEach((k,i) => rect.setAttribute(k,crop[i])); clip.append(rect); defs.append(clip);
  svg.setAttribute('viewBox', crop.join(' ')); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', room.concept.alt);
  image.setAttribute('href', room.concept.src); image.setAttribute('width',room.concept.width); image.setAttribute('height',room.concept.height); image.setAttribute('clip-path','url(#' + clipId + ')');
  svg.append(defs,image); button.append(svg,el('span','scene-expand','查看完整设计板 ↗'));
  button.addEventListener('click',() => imageDialog(room.concept.src,room.title + ' · 原始设计板'));
  section.append(button);
  const caption = el('div','scene-caption');
  caption.append(el('span','',room.theme + ' · ' + items(room).length + ' 件家具'),link('打开原图',room.concept.src,'original-link'));
  caption.lastChild.target = '_blank'; caption.lastChild.rel = 'noopener'; section.append(caption);
  return section;
 }
 function collection(room,selected) {
  const records = items(room);
  const section=el('section','concept-furniture-section');section.setAttribute('aria-labelledby','furniture-title');
  const header=sectionHeading('02 / OBJECTS','家具图鉴','从完整空间到每一件家具，细看造型、配色与材质。','furniture-title');
  header.append(el('span','concept-object-count',records.length+' 件家具'));section.append(header);
  const ready=records.filter(item=>item.image).length;
  if(ready<records.length)section.append(el('p','collection-progress',ready+' 张高清概念图已就绪 · '+(records.length-ready)+' 张暂未生成，仍可查看对应模型'));
  if(selected)section.append(detail(room,selected));
  const grid = el('div','furniture-grid');
  for (const item of records) {
   const card = el('article','furniture-card');
   const picture = link('',route(room,'concept',item),'product-link'); picture.setAttribute('aria-label','查看' + item.name + '详情'); picture.append(photo(item));
   if(selected?.id===item.id){
    card.classList.add('is-selected');picture.setAttribute('aria-current','true');
    card.addEventListener('click',event=>{
     if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
     const target=event.target.closest('a');
     if(target?.getAttribute('href')===route(room,'concept',item)){
      event.preventDefault();jumpTo(section.querySelector('.selected-concept'));
     }
    });
   }
   const info = el('div','furniture-info'); info.append(el('p','eyebrow','OBJECT ' + item.id));
   const title = el('h3'); title.append(link(item.name,route(room,'concept',item),'')); info.append(title);
   if(item.description) info.append(el('p','furniture-description',item.description));
   const actions = el('div','furniture-actions'); actions.append(link('概念图详情',route(room,'concept',item),''),link('查看模型 ↗',route(room,'model',item),''));
   info.append(actions); card.append(picture,info); grid.append(card);
  }
  section.append(grid);return section;
 }
 function detail(room,item) {
  const section=el('section','selected-concept');section.setAttribute('aria-labelledby','selected-concept-title');
  const bar=el('div','selected-concept-bar');bar.append(el('p','eyebrow','单件概念 / '+item.id),link('收起详情 ×',route(room,'concept'),'design-action'));
  section.append(bar);
  const layout = el('div','furniture-detail');
  const visual = el('div','detail-visual'), product = photo(item,false); visual.append(product);
  if(item.image) {
   const zoom = el('button','zoom-art','放大概念图 ⤢'); zoom.type='button'; zoom.addEventListener('click',() => imageDialog(item.image,item.name));
   visual.append(zoom);
  }
  const info = el('div','detail-info');
  const title=el('h3','',item.name);title.id='selected-concept-title';
  info.append(el('p','eyebrow',room.english + ' / OBJECT ' + item.id),title,el('p','intro',item.description));
  info.append(el('p','concept-note',item.image?'依据房间原设计重新绘制的独立概念图，用于查看造型与材质细节。实际模型请通过下方入口查看。':'这件家具的高清概念图暂未生成，可先查看对应的 3D 模型。'));
  if(item.image) info.append(el('p','art-dimensions',item.width + ' × ' + item.height + ' · 独立高清原图'));
  const actions = el('div','detail-actions'); actions.append(link('查看对应 3D 家具 ↗',route(room,'model',item),'primary-action'));
  if(item.image) {const original=link('打开高清原图',item.image);original.target='_blank';original.rel='noopener';actions.append(original);}
  info.append(actions);
  layout.append(visual,info); section.append(layout);return section;
 }
 function render(room,view,id) {
  const selected=items(room).find(item=>item.id===id);
  const returningToCollection=renderedRoom===room.id&&renderedItem&&!selected;
  root.replaceChildren(); root.style.setProperty('--accent',room.accent); root.style.setProperty('--tint',room.tint);
  const header=heading(room,room.title+' · 概念图集','场景与家具，在同一页展开。欣赏完整空间，也细看每一件独立设计。');
  const sceneSection=scene(room),furnitureSection=collection(room,selected);
  const actions=el('nav','design-actions');actions.setAttribute('aria-label','概念图集导航');
  const jump=el('button','design-action','家具图鉴 · '+items(room).length+' 件 ↓');jump.type='button';jump.addEventListener('click',()=>jumpTo(furnitureSection));
  actions.append(jump,link('进入 3D 空间 ↗',route(room,'model')));header.append(actions);
  const top=el('button','design-action','回到场景概念 ↑');top.type='button';top.addEventListener('click',()=>jumpTo(sceneSection));
  furnitureSection.append(top);top.classList.add('back-to-scene');
  root.append(header,sceneSection,furnitureSection);
  root.scrollTop=0;
  if(selected)jumpTo(root.querySelector('.selected-concept'));
  else if(returningToCollection)jumpTo(furnitureSection);
  else {const title=root.querySelector('h1');title.tabIndex=-1;title.focus({preventScroll:true});}
  renderedRoom=room.id;renderedItem=selected?.id||null;
 }
 window.DesignGallery={items,render};
})();

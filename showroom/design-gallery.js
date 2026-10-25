'use strict';
(() => {
 const root = document.getElementById('design-gallery');
 const items = room => window.FURNITURE_CATALOG?.[room.id] || [];
 const route = (room, view, item) => '#' + new URLSearchParams({room:room.id, ...(view !== 'model' ? {view} : {}), ...(item ? {item:item.id} : {})});
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
 function scene(room) {
  const header = heading(room, room.title + ' · 场景概念', '从空间的配色、造型与氛围，走进每一件家具的设计。');
  const actions = el('div', 'design-actions');
  actions.append(link('查看家具图鉴 →', route(room, 'furniture')), link('进入 3D 空间 ↗', route(room, 'model')));
  header.append(actions); root.append(header);
  const button = el('button', 'scene-concept'); button.type = 'button'; button.setAttribute('aria-label', '放大查看' + room.title + '完整设计板');
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), image = document.createElementNS(ns, 'image');
  const crop = room.concept.crop, clipId = 'scene-crop-' + room.id;
  const defs = document.createElementNS(ns, 'defs'), clip = document.createElementNS(ns, 'clipPath'), rect = document.createElementNS(ns, 'rect');
  clip.id = clipId; ['x','y','width','height'].forEach((k,i) => rect.setAttribute(k,crop[i])); clip.append(rect); defs.append(clip);
  svg.setAttribute('viewBox', crop.join(' ')); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', room.concept.alt);
  image.setAttribute('href', room.concept.src); image.setAttribute('width',room.concept.width); image.setAttribute('height',room.concept.height); image.setAttribute('clip-path','url(#' + clipId + ')');
  svg.append(defs,image); button.append(svg,el('span','scene-expand','查看完整设计板 ↗'));
  button.addEventListener('click',() => imageDialog(room.concept.src,room.title + ' · 原始设计板'));
  root.append(button);
  const caption = el('div','scene-caption');
  caption.append(el('span','',room.theme + ' · ' + items(room).length + ' 件家具'),link('打开原图',room.concept.src,'original-link'));
  caption.lastChild.target = '_blank'; caption.lastChild.rel = 'noopener'; root.append(caption);
 }
 function collection(room) {
  const records = items(room);
  const header = heading(room, room.title + ' · 家具图鉴', '独立高清概念图 · 浅色产品背景 · 对应真实 3D 家具');
  header.append(link('查看场景概念 →',route(room,'concept'))); root.append(header);
  const ready=records.filter(item=>item.image).length;
  if(ready<records.length)root.append(el('p','collection-progress',ready+' 张高清概念图已就绪 · '+(records.length-ready)+' 张暂未生成，仍可查看对应模型'));
  const grid = el('div','furniture-grid');
  for (const item of records) {
   const card = el('article','furniture-card');
   const picture = link('',route(room,'furniture',item),'product-link'); picture.setAttribute('aria-label','查看' + item.name + '详情'); picture.append(photo(item));
   const info = el('div','furniture-info'); info.append(el('p','eyebrow','OBJECT ' + item.id));
   const title = el('h2'); title.append(link(item.name,route(room,'furniture',item),'')); info.append(title);
   if(item.description) info.append(el('p','furniture-description',item.description));
   const actions = el('div','furniture-actions'); actions.append(link('概念图详情',route(room,'furniture',item),''),link('查看模型 ↗',route(room,'model',item),''));
   info.append(actions); card.append(picture,info); grid.append(card);
  }
  root.append(grid);
 }
 function detail(room,item) {
  root.append(link('← 全部家具',route(room,'furniture'),'design-back'));
  const layout = el('div','furniture-detail');
  const visual = el('div','detail-visual'), product = photo(item,false); visual.append(product);
  if(item.image) {
   const zoom = el('button','zoom-art','放大概念图 ⤢'); zoom.type='button'; zoom.addEventListener('click',() => imageDialog(item.image,item.name));
   visual.append(zoom);
  }
  const info = el('div','detail-info');
  info.append(el('p','eyebrow',room.english + ' / OBJECT ' + item.id),el('h1','',item.name),el('p','intro',item.description));
  info.append(el('p','concept-note',item.image?'依据房间原设计重新绘制的独立概念图，用于查看造型与材质细节。实际模型请通过下方入口查看。':'这件家具的高清概念图暂未生成，可先查看对应的 3D 模型。'));
  if(item.image) info.append(el('p','art-dimensions',item.width + ' × ' + item.height + ' · 独立高清原图'));
  const actions = el('div','detail-actions'); actions.append(link('查看对应 3D 家具 ↗',route(room,'model',item),'primary-action'));
  if(item.image) {const original=link('打开高清原图',item.image);original.target='_blank';original.rel='noopener';actions.append(original);}
  info.append(actions,link('回到场景概念',route(room,'concept'),'original-link'));
  layout.append(visual,info); root.append(layout);
  const siblings=el('nav','furniture-siblings'); siblings.setAttribute('aria-label','切换家具');
  for(const other of items(room)) {const n=link(other.id + ' ' + other.name,route(room,'furniture',other),'sibling-link');if(other.id===item.id)n.setAttribute('aria-current','page');siblings.append(n);}
  root.append(siblings);
 }
 function render(room,view,id) {
  root.replaceChildren(); root.style.setProperty('--accent',room.accent); root.style.setProperty('--tint',room.tint);
  if(view==='concept') scene(room);
  else { const item=items(room).find(item=>item.id===id); if(item) detail(room,item); else collection(room); }
  root.scrollTop=0;
  const title=root.querySelector('h1'); if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
 }
 window.DesignGallery={items,render};
})();

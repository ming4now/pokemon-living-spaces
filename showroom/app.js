'use strict';
(()=>{
 const rooms=Array.isArray(window.ROOM_CATALOG)?window.ROOM_CATALOG:[];
 const $=id=>document.getElementById(id);
 const byId=new Map(rooms.map(room=>[room.id,room]));
 let activeFrame=null,activeRoom=null,poll=null,loadTimer=null,generation=0,lastCard=null;
 const route=(id,kind='model')=>'#'+new URLSearchParams({room:id,...(kind==='video'?{view:'video'}:{})});
 function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
 function roomLink(room,className,text,kind='model'){
  const link=node('a',className,text);link.href=route(room.id,kind);link.dataset.room=room.id;
  link.addEventListener('click',()=>{lastCard=link;});return link;
 }
 function buildGallery(){
  $('room-count').textContent=String(rooms.length).padStart(2,'0');
  for(const [i,room] of rooms.entries()){
   const card=node('article','room-card');card.style.setProperty('--accent',room.accent||'#456e88');card.style.setProperty('--tint',room.tint||'#e9f1f7');
   const cover=roomLink(room,'cover-link');cover.setAttribute('aria-label','进入'+room.theme+' · '+room.title+'的 3D 空间');
   const image=node('img');image.src=room.cover;image.alt=room.coverAlt||room.title;image.width=1440;image.height=960;image.decoding='async';image.loading=i<2?'eager':'lazy';cover.append(image);
   cover.append(node('span','type-badge',room.theme));const cta=node('span','cover-cta','进入空间');cta.append(node('span','','↗'));cover.append(cta);card.append(cover);
   const info=node('div','card-info'),kicker=node('div','card-kicker');kicker.append(node('span','',room.english||room.theme),node('span','number',String(i+1).padStart(2,'0')));info.append(kicker);
   const title=node('h2','card-title');title.append(roomLink(room,'',room.title));info.append(title,node('p','card-description',room.description));
   const bottom=node('div','card-bottom'),features=node('div','features');(room.features||[]).forEach(text=>features.append(node('span','feature',text)));bottom.append(features);
   if(room.video){const video=roomLink(room,'video-link','24 小时影片','video');const icon=node('span','','▷');icon.setAttribute('aria-hidden','true');video.prepend(icon);bottom.append(video);}
   info.append(bottom);card.append(info);$('room-grid').append(card);
   const option=node('option','',room.theme+' · '+room.title);option.value=room.id;$('room-switch').append(option);
  }
  if(!rooms.length){$('room-grid').append(node('p','intro','展厅暂时没有作品。'));}
 }
 function disposeFrame(){
  generation++;clearInterval(poll);clearTimeout(loadTimer);poll=null;loadTimer=null;
  if(activeFrame){
   try{
    const win=activeFrame.contentWindow;win.document.querySelectorAll('video,audio').forEach(media=>media.pause());
    const viewer=activeRoom?.readyGlobal?win[activeRoom.readyGlobal]:null;
    if(viewer?.renderer){
     // Deliberate disposal must not trigger the viewer's unexpected-loss message.
     viewer.renderer.domElement.addEventListener('webglcontextlost',event=>{event.stopImmediatePropagation();event.preventDefault();},{capture:true,once:true});
     viewer.renderer.dispose();viewer.renderer.forceContextLoss();
    }
   }catch(error){/* file:// frames can be separate origins; removing the frame still unloads it. */}
   activeFrame.remove();activeFrame=null;activeRoom=null;
  }
 }
 function resetLoader(room,kind,url){
  $('exhibit-loading').hidden=false;$('loading-title').textContent='正在打开「'+room.title+'」';
  $('loading-description').textContent=kind==='video'?'正在准备影片与音乐。':'正在载入 3D 空间，首次打开需要片刻。';
  $('loading-open').href=url;$('loading-open').hidden=true;
 }
 function openRoom(room,kind){
  disposeFrame();const ticket=generation;kind=kind==='video'&&room.video?'video':'model';const url=kind==='video'?room.video:room.viewer;
  $('gallery').hidden=true;$('exhibit').hidden=false;document.body.classList.add('in-exhibit');
  $('room-switch').value=room.id;$('mode-video').hidden=!room.video;
  $('mode-model').setAttribute('aria-pressed',String(kind==='model'));$('mode-video').setAttribute('aria-pressed',String(kind==='video'));
  $('standalone').href=url;document.title=room.title+' · '+(kind==='video'?'昼夜影片':'室内设计展厅');resetLoader(room,kind,url);
  const frame=document.createElement('iframe');frame.title=room.theme+' · '+room.title+(kind==='video'?'昼夜影片':'交互式 3D 空间');
  frame.allow='fullscreen';frame.setAttribute('allowfullscreen','');activeFrame=frame;activeRoom=room;
  const ready=()=>{if(ticket!==generation)return;$('exhibit-loading').hidden=true;clearInterval(poll);clearTimeout(loadTimer);};
  const failure=()=>{if(ticket!==generation)return;clearInterval(poll);clearTimeout(loadTimer);$('loading-title').textContent='房间暂时未能打开';$('loading-description').textContent='可以独立打开，或返回展厅重试。';$('loading-open').hidden=false;};
  frame.addEventListener('load',()=>{
   if(ticket!==generation)return;
   try{
    const win=frame.contentWindow,doc=win.document;
    win.addEventListener('keydown',event=>{if(event.key==='Escape')location.hash='';});
    const inspect=()=>{
     if(ticket!==generation)return;
     try{
      if(kind==='video'){if(doc.querySelector('video')?.readyState>=2)ready();}
      else if(!room.readyGlobal||win[room.readyGlobal]?.ready)ready();
      const error=doc.getElementById('error');if(error&&getComputedStyle(error).display!=='none')failure();
     }catch(error){ready();}
    };
    if(doc.title==='Error response'||(kind==='video'&&!doc.querySelector('video'))){failure();return;}
    inspect();if(!$('exhibit-loading').hidden)poll=setInterval(inspect,220);
   }catch(error){ready();}
  });
  frame.addEventListener('error',failure);
  loadTimer=setTimeout(()=>{if(ticket===generation){$('loading-description').textContent='载入时间较长，可尝试独立打开。';$('loading-open').hidden=false;}},90000);
  frame.src=url;$('frame-host').append(frame);$('back-gallery').focus({preventScroll:true});
 }
 function onRoute(){
  const params=new URLSearchParams(location.hash.slice(1)),room=byId.get(params.get('room'));
  if(room){openRoom(room,params.get('view'));return;}
  disposeFrame();$('gallery').hidden=false;$('exhibit').hidden=true;document.body.classList.remove('in-exhibit');document.title='室内设计展厅 · Pokémon Living Spaces';
  if(params.has('room'))history.replaceState(null,'',location.pathname+location.search);
  if(lastCard){lastCard.focus({preventScroll:true});lastCard=null;}
 }
 $('room-switch').addEventListener('change',()=>{location.hash=route($('room-switch').value).slice(1);});
 $('mode-model').addEventListener('click',()=>{location.hash=route($('room-switch').value).slice(1);});
 $('mode-video').addEventListener('click',()=>{location.hash=route($('room-switch').value,'video').slice(1);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('exhibit').hidden)location.hash='';});
 window.addEventListener('hashchange',onRoute);window.addEventListener('pagehide',disposeFrame);
 window.addEventListener('pageshow',event=>{if(event.persisted)onRoute();});
 buildGallery();onRoute();
})();

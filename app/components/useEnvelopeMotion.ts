'use client';
import {useLayoutEffect,useRef,useState,type RefObject} from 'react';
import gsap from 'gsap';

/** First tap grants entry; afterward one reversible timeline follows scroll. */
export function useEnvelopeMotion(root:RefObject<HTMLElement|null>){
 const animation=useRef<gsap.core.Timeline|null>(null);
 const autoScroll=useRef<gsap.core.Tween|null>(null);
 const activate=useRef<(()=>void)|null>(null);
 const [phase,setPhase]=useState(0);
 const [opening,setOpening]=useState(false);
 const [unlocked,setUnlocked]=useState(false);
 useLayoutEffect(()=>{
  const html=document.documentElement,body=document.body;
  const previous={htmlOverflow:html.style.overflow,bodyOverflow:body.style.overflow,position:body.style.position,top:body.style.top,width:body.style.width};
  let locked=true,entered=false,disposed=false,lastPhase=-1;
  const runway=root.current?.querySelector<HTMLElement>('.envelope-runway');
  const scene=root.current?.querySelector<HTMLElement>('.experience-scene');
  const envelope=root.current?.querySelector<HTMLElement>('.envelope-wrap');
  const copy=root.current?.querySelector<HTMLElement>('.hero-copy');
  const actions=root.current?.querySelector<HTMLElement>('.scene-actions');
  window.scrollTo({top:0,behavior:'instant'});
  html.style.overflow='hidden';body.style.overflow='hidden';body.style.position='fixed';body.style.top='0';body.style.width='100%';
  const unlock=()=>{
   if(!locked)return;
   locked=false;html.style.overflow=previous.htmlOverflow;body.style.overflow=previous.bodyOverflow;
   body.style.position=previous.position;body.style.top=previous.top;body.style.width=previous.width;
  };
  const range=()=>Math.max(1,(runway?.offsetHeight??0)-(scene?.offsetHeight??innerHeight));
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const followScroll=()=>{
   if(!entered||!animation.current)return;
   const p=gsap.utils.clamp(0,1,window.scrollY/range());
   animation.current.progress(reduced()?(p>.5?1:0):p);
  };
  const layout=()=>{
   if(disposed||!envelope||!copy||!actions||!scene)return;
   envelope.style.maxWidth='';envelope.style.top='';
   if(matchMedia('(orientation:landscape) and (max-height:540px)').matches)return;
   const gap=innerWidth<768?20:26;
   const top=copy.offsetTop+copy.offsetHeight+gap;
   const bottom=actions.offsetTop-gap;
   const available=Math.max(100,bottom-top);
   envelope.style.maxWidth=`${available*1.62}px`;
   envelope.style.top=`${top+available/2}px`;
  };
  const context=gsap.context(()=>{
   animation.current=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},onUpdate(){
    const p=this.progress();const next=p<.015?0:p<.45?1:p<.985?2:3;
    if(next!==lastPhase){lastPhase=next;setPhase(next);}
   }})
    .to('.seal-left',{x:-4,rotation:-3,duration:.18},0)
    .to('.seal-right',{x:4,rotation:3,duration:.18},0)
    .to('.seal-left',{x:-30,y:24,rotation:-19,opacity:0,duration:.4},.18)
    .to('.seal-right',{x:30,y:20,rotation:17,opacity:0,duration:.4},.18)
    .to('.hero-copy',{opacity:0,y:-14,duration:.45},.2)
    .to('.envelope-photo',{opacity:0,duration:.35},.58)
    .to('.flap',{rotationX:-90,duration:.5,ease:'power1.in'},.78)
    .to('.fold-shade',{opacity:.28,duration:.5},.78)
    .set('.flap',{zIndex:1},1.28)
    .to('.flap',{rotationX:-178,duration:.55,ease:'power1.out'},1.28)
    .to('.fold-shade',{opacity:0,duration:.55},1.28)
    .to('.letter',{yPercent:-72,rotation:0,duration:1.1},1.8)
    .to('.letter-shadow',{opacity:.2,duration:.7},1.8)
    .to('.envelope-shadow',{scaleX:1.08,opacity:.4,duration:.8},1.8)
    .to({}, {duration:.18},2.9);
  },root);
  const finishAuto=()=>{autoScroll.current=null;setOpening(false);followScroll();};
  activate.current=()=>{
   if(autoScroll.current)return;
   if(!entered){entered=true;setUnlocked(true);unlock();layout();}
   const target=range();
   if(reduced()){window.scrollTo({top:target,behavior:'instant'});followScroll();return;}
   setOpening(true);
   const position={y:window.scrollY};
   autoScroll.current=gsap.to(position,{y:target,duration:Math.max(.8,3.1*(1-(animation.current?.progress()??0))),ease:'none',onUpdate(){window.scrollTo({top:position.y,behavior:'instant'});followScroll();},onComplete:finishAuto});
  };
  const interrupt=()=>{if(autoScroll.current){autoScroll.current.kill();finishAuto();}};
  const resize=()=>{layout();followScroll();};
  layout();void document.fonts.ready.then(layout);
  window.addEventListener('scroll',followScroll,{passive:true});window.addEventListener('resize',resize);
  window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});window.addEventListener('keydown',interrupt);
  return()=>{
   disposed=true;autoScroll.current?.kill();autoScroll.current=null;activate.current=null;animation.current=null;context.revert();unlock();
   if(envelope){envelope.style.maxWidth='';envelope.style.top='';}
   window.removeEventListener('scroll',followScroll);window.removeEventListener('resize',resize);
   window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);window.removeEventListener('keydown',interrupt);
  };
 },[root]);
 function open(){
  if(phase===3){root.current?.querySelector('#greeting')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
  activate.current?.();
 }
 return {phase,opening,open,unlocked};
}

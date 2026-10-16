'use client';
import {useEffect,useRef,useState,type RefObject} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** The scroll and button paths share one timeline and one native sticky scene. */
export function useEnvelopeMotion(root:RefObject<HTMLElement|null>,runway:RefObject<HTMLElement|null>){
 const trigger=useRef<ScrollTrigger|null>(null);
 const autoScroll=useRef<gsap.core.Tween|null>(null);
 const [phase,setPhase]=useState(0);
 const [opening,setOpening]=useState(false);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  const media=gsap.matchMedia();
  const context=gsap.context(()=>{
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    let lastPhase=-1;
    const timeline=gsap.timeline({defaults:{ease:'none'},onUpdate(){
     const progress=this.progress();const next=progress<.16?0:progress<.47?1:progress<.84?2:3;
     if(next!==lastPhase){lastPhase=next;setPhase(next)}
    }});
    timeline
     .to('.hero-copy',{opacity:0,y:-20,duration:.6},.12)
     .to('.festival-poster',{opacity:.24,scale:.94,duration:.75},.12)
     .fromTo('.envelope',{rotation:-2},{rotation:0,duration:.7},.12)
     .to('.envelope-photo',{opacity:0,duration:.55},.5)
     .to('.seal',{rotation:-12,scale:.96,y:-4,duration:.2},.3)
     .to('.seal',{rotation:18,rotationX:38,y:28,x:12,opacity:0,duration:.45,ease:'power1.in'},.5)
     .to('.flap',{rotationX:-90,duration:.6,ease:'power1.in'},.85)
     .to('.fold-shade',{opacity:.38,duration:.6},.85)
     .set('.flap',{zIndex:1},1.45)
     .to('.flap',{rotationX:-178,duration:.65,ease:'power1.out'},1.45)
     .to('.fold-shade',{opacity:0,duration:.65},1.45)
     .to('.letter',{yPercent:-87,rotation:-1.2,duration:1.45,ease:'power1.inOut'},2.12)
     .to('.letter-shadow',{opacity:.3,scaleX:.92,duration:1},2.12)
     .to('.envelope-front',{y:4,duration:1},2.12)
     .to('.envelope-shadow',{scaleX:1.12,opacity:.45,duration:1},2.12)
     .to('.letter',{rotation:0,duration:.4},3.57)
     .to('.read-prompt',{opacity:1,y:0,duration:.4},3.6)
     .to({}, {duration:.5});
    trigger.current=ScrollTrigger.create({trigger:runway.current,start:'top top',end:'bottom bottom',animation:timeline,scrub:.18,invalidateOnRefresh:true});
    return()=>{autoScroll.current?.kill();trigger.current=null};
   });
   media.add('(prefers-reduced-motion: reduce)',()=>{setPhase(3)});
  },root);
  function interrupt(){if(autoScroll.current){autoScroll.current.kill();autoScroll.current=null;setOpening(false)}}
  window.addEventListener('touchstart',interrupt,{passive:true});window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('keydown',interrupt);
  return()=>{interrupt();media.revert();context.revert();window.removeEventListener('touchstart',interrupt);window.removeEventListener('wheel',interrupt);window.removeEventListener('keydown',interrupt)};
 },[root,runway]);
 function open(){
  const scroll=trigger.current;
  if(!scroll||phase===3){root.current?.querySelector('.card-column')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return}
  if(opening)return;
  setOpening(true);autoScroll.current?.kill();
  const position={y:window.scrollY};
  autoScroll.current=gsap.to(position,{y:scroll.start+(scroll.end-scroll.start)*.98,duration:Math.max(1.1,3.3*(1-scroll.progress)),ease:'power1.inOut',onUpdate:()=>window.scrollTo({top:position.y,behavior:'instant'}),onComplete:()=>{autoScroll.current=null;setOpening(false)}});
 }
 function replay(){autoScroll.current?.kill();autoScroll.current=null;setOpening(false);window.scrollTo({top:trigger.current?.start??0,behavior:'instant'})}
 return {phase,opening,open,replay};
}

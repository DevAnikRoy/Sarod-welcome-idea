'use client';
import {useLayoutEffect,useRef,useState,type RefObject} from 'react';
import gsap from 'gsap';

/** Tap opens first; returning up the page reverses the paper animation. */
export function useEnvelopeMotion(root:RefObject<HTMLElement|null>){
 const animation=useRef<gsap.core.Timeline|null>(null);
 const releaseScroll=useRef<(()=>void)|null>(null);
 const [phase,setPhase]=useState(0);
 const [opening,setOpening]=useState(false);
 const [unlocked,setUnlocked]=useState(false);
 useLayoutEffect(()=>{
  const html=document.documentElement;
  const body=document.body;
  const previous={htmlOverflow:html.style.overflow,bodyOverflow:body.style.overflow,position:body.style.position,top:body.style.top,width:body.style.width};
  let locked=false;
  let hasOpened=false;
  let away=false;
  let lastY=0;
  const unlock=()=>{
   if(!locked)return;
   locked=false;
   html.style.overflow=previous.htmlOverflow;
   body.style.overflow=previous.bodyOverflow;
   body.style.position=previous.position;
   body.style.top=previous.top;
   body.style.width=previous.width;
  };
  const lock=()=>{
   if(locked)return;
   window.scrollTo({top:0,behavior:'instant'});
   locked=true;
   html.style.overflow='hidden';
   body.style.overflow='hidden';
   body.style.position='fixed';
   body.style.top='0';
   body.style.width='100%';
  };
  lock();
  releaseScroll.current=unlock;
  const context=gsap.context(()=>{
   animation.current=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'},onUpdate(){
    const progress=this.progress();
    setPhase(progress<.42?1:2);
   },onComplete(){hasOpened=true;away=false;setUnlocked(true);setPhase(3);setOpening(false);unlock();},onReverseComplete(){setPhase(0);setOpening(false);}})
    .to('.hero-copy',{opacity:0,y:-14,duration:.4},0)
    .to('.envelope-photo',{opacity:0,duration:.35},.15)
    .to('.envelope',{rotation:0,duration:.4},0)
    .to('.flap',{rotationX:-90,duration:.55,ease:'power1.in'},.4)
    .to('.fold-shade',{opacity:.28,duration:.55},.4)
    .set('.flap',{zIndex:1},.95)
    .to('.flap',{rotationX:-178,duration:.6,ease:'power1.out'},.95)
    .to('.fold-shade',{opacity:0,duration:.6},.95)
    .to('.letter',{yPercent:-72,rotation:0,duration:1.15},1.5)
    .to('.letter-shadow',{opacity:.2,duration:.7},1.5)
    .to('.envelope-shadow',{scaleX:1.08,opacity:.4,duration:.8},1.5)
    .to({}, {duration:.2},2.6);
  },root);
  function onScroll(){
   const y=window.scrollY;
   const timeline=animation.current;
   if(hasOpened&&timeline&&!timeline.isActive()){
    if(y>Math.min(160,innerHeight*.3))away=true;
    if(away&&y<lastY&&y<=innerHeight*.35&&timeline.progress()===1){
     away=false;setOpening(true);
     if(matchMedia('(prefers-reduced-motion: reduce)').matches)timeline.reverse().progress(0);
     else timeline.timeScale(1.2).reverse();
    }
   }
   lastY=y;
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{window.removeEventListener('scroll',onScroll);animation.current=null;releaseScroll.current=null;context.revert();unlock();};
 },[root]);
 function open(){
  if(phase===3){root.current?.querySelector('#greeting')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
  if(opening)return;
  const timeline=animation.current;
  if(!timeline){releaseScroll.current?.();setUnlocked(true);setPhase(3);return;}
  window.scrollTo({top:0,behavior:'instant'});
  setOpening(true);setPhase(1);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)timeline.progress(1);
  else timeline.timeScale(1).play(0);
 }
 return {phase,opening,open,unlocked};
}

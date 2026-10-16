'use client';
import {useRef} from 'react';
import {useEnvelopeMotion} from './useEnvelopeMotion';

import type {Invitation} from '../../lib/types';
import {Header,Footer,Lotus,Ornament,GoldWaves} from './Decor';
import GreetingCard from './GreetingCard';
import ShareActions from './ShareActions';
import FestivalAudio, {type FestivalAudioHandle} from './FestivalAudio';
export default function Experience({card,shared=false}:{card:Invitation;shared?:boolean}){
 const root=useRef<HTMLElement>(null);const runway=useRef<HTMLElement>(null);
 const {phase,opening,open,replay}=useEnvelopeMotion(root,runway);
 const music=useRef<FestivalAudioHandle>(null);
 const openLetter=()=>{music.current?.start();open();};
 const hints=['খামে ট্যাপ করুন—চিঠি খুলবে, ঢাক বাজবে।','সিল ছাড়ছে, খুলছে ভালোবাসার খাম…','ভেতর থেকে আসছে আপনার আমন্ত্রণ…','ভালোবাসায় লেখা, আপনার জন্য।']; return <main ref={root} className="invitation-experience"><Header/><FestivalAudio ref={music}/><section className="envelope-runway" ref={runway} aria-label="স্ক্রলের সঙ্গে খাম খুলুন"><div className="experience-scene" id="start" data-phase={phase}><div className="autumn-field" aria-hidden="true"/><div className="hero-copy"><p className="eyebrow">{shared?`${card.name}-এর পক্ষ থেকে`:'কাশফুলের শুভ্রতায়, উৎসবের রঙে'}</p><h1>শরতের হাওয়ায়,<br/><span>আপনার জন্য একটি চিঠি…</span></h1><Ornament/><p>{shared?`${card.recipient||'প্রিয় আপনজন'}, আপনার জন্য রইল সপরিবারে আমন্ত্রণ।`:'পুজোর আনন্দ, ভালোবাসা আর শুভেচ্ছা পৌঁছে দিন প্রিয় মানুষের কাছে, এক মুঠো কথার চিঠিতে।'}</p></div><div className="envelope-wrap"><button type="button" className="envelope-tap-target" onClick={openLetter} disabled={opening||phase>0} aria-label="খামে ট্যাপ করে চিঠি খুলুন ও ঢাক শুনুন" aria-describedby="envelope-tap-hint"/><div className="envelope-shadow"/><div className="envelope"><div className="envelope-back"/><img className="envelope-photo" src="/images/handmade-envelope.webp" alt="সোনালি কাশফুলের নকশা ও লাল পদ্মসিলের হাতে তৈরি খাম" width="1200" height="742" fetchPriority="high"/><div className="letter-shadow" aria-hidden="true"/><article className="letter"><Lotus/><p>{card.event}</p><h2>সাদর আমন্ত্রণ</h2><div className="letter-signature">{card.photo&&<img src={card.photo} alt="" width="32" height="32"/>}<span>{card.name}</span></div></article><div className="flap"><div className="flap-face front"><GoldWaves/><span className="fold-shade"/></div><div className="flap-face back"><span className="fold-shade"/></div></div><div className="envelope-front"><GoldWaves/><span className="envelope-address">প্রাপক: {card.recipient||'প্রিয় আপনজন'}</span></div><div className="seal" aria-hidden="true"><Lotus/></div></div></div><div className="scene-actions"><button className="primary" onClick={openLetter} disabled={opening}>{opening?'খাম খুলছে…':phase===3?'আমন্ত্রণটি পড়ুন':'ট্যাপ করে চিঠি খুলুন'} <span>↓</span></button><p id="envelope-tap-hint" aria-live="polite">{hints[phase]}</p><button className="replay-button" onClick={replay} disabled={phase!==3}>আবার খামটি খুলুন ↺</button></div><span className="read-prompt" aria-hidden="true">আপনার চিঠি এসে গেছে</span><div className="scroll-progress" aria-hidden="true">{[0,1,2,3].map(step=><span key={step} className={step<=phase?"active":""}/>)}</div></div></section><section id="greeting" className="greeting"><div className="halo" aria-hidden="true"/><div className="greeting-layout"><div className="greeting-aside reveal"><p className="eyebrow">শরৎ এসেছে, চিঠি এনেছে</p><h2>মায়ের আগমনে<br/>আনন্দ থাকুক <br/><em>প্রতিটি প্রাণে।</em></h2><Ornament/><p>ঢাকের তালে, শিউলির সুবাসে,<br/>দেখা হোক উৎসবের আঙিনায়।</p><img src="/images/diya.webp" alt="আলোকিত মাটির প্রদীপ" width="420" height="300" loading="lazy"/></div><div className="card-column"><GreetingCard card={card}/>{shared&&card.id&&<ShareActions path={`/c/${card.id}`} name={card.name}/>}</div></div></section><section className="festival-story"><div className="story-photo"><img src="/images/kash.webp" alt="নীল আকাশের নিচে আসল সাদা কাশফুল" width="1400" height="890" loading="lazy"/></div><div className="story-copy reveal"><Lotus/><p className="eyebrow">আপনার নাম, আপনার ছবি, আপনার আমন্ত্রণ</p><h2>এই আনন্দে<br/>আপনজন থাকুক পাশে।</h2><p>ছবি আর মনের কথায় সাজিয়ে নিন নিজের চিঠি।<br/>তারপর একটি লিংকেই পাঠিয়ে দিন সবার কাছে।</p><a className="primary" href="/create">নিজের আমন্ত্রণ তৈরি করুন ↗</a></div></section><Footer/></main>
}







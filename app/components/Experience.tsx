'use client';
import {useRef} from 'react';
import {useEnvelopeMotion} from './useEnvelopeMotion';

import type {Invitation} from '../../lib/types';
import {Header,Footer,Lotus,Ornament,GoldWaves} from './Decor';
import GreetingCard from './GreetingCard';
import ShareActions from './ShareActions';
import FestivalAudio, {type FestivalAudioHandle} from './FestivalAudio';
export default function Experience({card,shared=false}:{card:Invitation;shared?:boolean}){
 const root=useRef<HTMLElement>(null);
 const {phase,opening,open,unlocked}=useEnvelopeMotion(root);
 const music=useRef<FestivalAudioHandle>(null);
 const openLetter=()=>{music.current?.start();open();};
 return <main ref={root} className="invitation-experience"><Header/><FestivalAudio ref={music}/><section className="envelope-runway" aria-label="ট্যাপ করে খাম খুলুন"><div className="experience-scene" id="start" data-phase={phase}><div className="autumn-field" aria-hidden="true"/><div className="hero-copy"><h1>এবার পুজোয়,<br/><span>আসছেন তো?</span></h1><Ornament/><p>{shared?`${card.recipient||'প্রিয় আপনজন'}, পরিবারের সবাইকে নিয়ে আসবেন। আপনাদের অপেক্ষায় রইলাম।`:'পরিবারের সবাইকে নিয়ে আসবেন। পুজোর কটা দিন একসঙ্গে গল্প করে কাটাই।'}</p></div><div className="envelope-wrap"><button type="button" className="envelope-tap-target" onClick={openLetter} disabled={opening||phase>0} aria-label="আমন্ত্রণ খুলুন"/><div className="envelope-shadow"/><div className="envelope"><div className="envelope-back"/><img className="envelope-photo" src="/images/handmade-envelope.webp" alt="সোনালি কাশফুলের নকশা ও লাল পদ্মসিলের হাতে তৈরি খাম" width="1200" height="742" fetchPriority="high"/><div className="seal-pieces" aria-hidden="true"><span className="seal-piece seal-left"><img src="/images/handmade-envelope.webp" alt="" width="1200" height="742"/></span><span className="seal-piece seal-right"><img src="/images/handmade-envelope.webp" alt="" width="1200" height="742"/></span></div><div className="letter-shadow" aria-hidden="true"/><article className="letter"><Lotus/><p>{card.event}</p><h2>সাদর আমন্ত্রণ</h2><div className="letter-signature">{card.photo&&<img src={card.photo} alt="" width="32" height="32"/>}<span>{card.name}</span></div></article><div className="flap"><div className="flap-face front"><GoldWaves/><span className="fold-shade"/></div><div className="flap-face back"><span className="fold-shade"/></div></div><div className="envelope-front"><GoldWaves/><span className="envelope-address">প্রাপক: {card.recipient||'প্রিয় আপনজন'}</span></div><div className="seal" aria-hidden="true"><Lotus/></div></div></div><div className="scene-actions"><button className="primary" onClick={openLetter} disabled={opening}>{opening?'…':phase===3?'আমন্ত্রণ পড়ুন':'চিঠি খুলুন'} <span>↓</span></button></div><div className="scroll-progress" aria-hidden="true">{[0,1,2,3].map(step=><span key={step} className={step<=phase?"active":""}/>)}</div></div></section><div className="invitation-content" inert={!unlocked}><section id="greeting" className="greeting"><div className="halo" aria-hidden="true"/><div className="greeting-layout"><div className="greeting-aside reveal"><h2>সবাই মিলে<br/>পুজোর আনন্দটা<br/><em>ভাগ করে নিই।</em></h2><Ornament/><p>সারা বছর তো ব্যস্ততায় কাটে।<br/>পুজোয় অন্তত একদিন একসঙ্গে বসি।</p><img src="/images/diya.webp" alt="আলোকিত মাটির প্রদীপ" width="420" height="300" loading="lazy"/></div><div className="card-column"><GreetingCard card={card}/>{shared&&card.id&&<ShareActions path={`/c/${card.id}`} name={card.name}/>}</div></div></section><section className="festival-story"><div className="story-photo"><img src="/images/kash.webp" alt="নীল আকাশের নিচে আসল সাদা কাশফুল" width="1400" height="890" loading="lazy"/></div><div className="story-copy reveal"><Lotus/><h2>আপনজনদেরও<br/>নিমন্ত্রণ জানাবেন?</h2><p>নিজের নাম ও ছবি দিয়ে আমন্ত্রণটি তৈরি করুন।</p><a className="primary" href="/create">আমন্ত্রণ তৈরি করুন ↗</a></div></section><Footer/></div></main>
}







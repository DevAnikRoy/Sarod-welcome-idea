import type {Invitation} from '../../lib/types';
import {Ornament} from './Decor';
export default function GreetingCard({card,compact=false}:{card:Invitation;compact?:boolean}){
 const date=card.date?new Intl.DateTimeFormat('bn-BD',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${card.date}T12:00:00Z`)):'';
 const time=card.time?new Intl.DateTimeFormat('bn-BD',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'UTC'}).format(new Date(`2000-01-01T${card.time}:00Z`)):'';
 return <article className={`greeting-card ${compact?'compact':''}`}><div className="card-idol"><img src="/images/durga.webp" alt="কলকাতার পূজামণ্ডপে দুর্গা প্রতিমা" width="480" height="360"/></div><div className="card-content"><p className="card-kicker">{card.event}</p><h2>শুভ শারদীয়া</h2><Ornament/><p className="recipient">{card.recipient||'প্রিয় আপনজন'},</p><p className="wish">{card.message}</p>{(card.venue||date||time)&&<div className="event-details"><span>আপনার সপরিবারে উপস্থিতি কামনা করি</span>{card.venue&&<strong>{card.venue}</strong>}{(date||time)&&<p>{[date,time].filter(Boolean).join(' · ')}</p>}</div>}<div className="signature">{card.photo&&<img className="sender-photo" src={card.photo} alt={`${card.name}-এর ছবি`} width="72" height="72"/>}<div><span>ভালোবাসা ও আমন্ত্রণে</span><strong>{card.name}</strong></div></div></div></article>
}

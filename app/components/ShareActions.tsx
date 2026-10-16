'use client';
import {useState} from 'react';
export default function ShareActions({path,name}:{path:string;name:string}){const [notice,setNotice]=useState('');const [fallback,setFallback]=useState('');
 async function share(copy=false){const url=new URL(path,location.origin).href;try{if(!copy&&navigator.share){await navigator.share({title:`${name}-এর শারদীয় আমন্ত্রণ`,text:`${name}-এর পক্ষ থেকে পুজোর নিমন্ত্রণ।`,url});return}if(navigator.clipboard){await navigator.clipboard.writeText(url);setNotice('লিংক কপি হয়েছে।')}else{setFallback(url);setNotice('নিচের লিংকটি বেছে কপি করুন।')}}catch(error){if((error as Error).name!=='AbortError'){setFallback(url);setNotice('নিচের লিংকটি বেছে কপি করুন।')}}}
 return <div className="share-actions"><div className="button-row"><button className="primary" onClick={()=>share()}>আমন্ত্রণ শেয়ার করুন ↗</button><button className="outline" onClick={()=>share(true)}>লিংক কপি করুন</button></div><p className="status" role="status">{notice}</p>{fallback&&<input aria-label="শেয়ার করার লিংক" readOnly value={fallback} onFocus={e=>e.currentTarget.select()}/>}</div>
}

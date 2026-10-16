import sharp from 'sharp';
import {createCard} from '../../../lib/store';
import type {Invitation} from '../../../lib/types';
import {sameOrigin} from '../../../lib/origin';
export const runtime='nodejs';
const MAX=6*1024*1024;
const attempts=new Map<string,{start:number;count:number}>();
export async function POST(request:Request){
 try{
  if(!sameOrigin(request))return Response.json({error:'এই সাইট থেকে আবার চেষ্টা করুন।'},{status:403});
  if(Number(request.headers.get('content-length'))>MAX)return Response.json({error:'ছবি সর্বোচ্চ ৫ MB হতে পারবে।'},{status:413});
  // A small server-wide limit is intentional for this private, small-group installation.
  const key='small-group';const now=Date.now();let bucket=attempts.get(key);if(!bucket||now-bucket.start>3600000){bucket={start:now,count:0};attempts.set(key,bucket)}if(bucket.count>=30)return Response.json({error:'এক ঘণ্টায় অনেকগুলো কার্ড তৈরি হয়েছে। একটু পরে চেষ্টা করুন।'},{status:429});bucket.count++;
  const reader=request.body?.getReader();if(!reader)return Response.json({error:'ফর্মটি পূরণ করুন।'},{status:400});let size=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX){await reader.cancel();return Response.json({error:'ছবি সর্বোচ্চ ৫ MB হতে পারবে।'},{status:413})}chunks.push(value)}
  const body=Buffer.concat(chunks);const form=await new Response(body,{headers:{'content-type':request.headers.get('content-type')||''}}).formData();
  const limits={name:60,recipient:60,message:400,event:100,venue:180,date:10,time:5};const values:Record<string,string>={};
  for(const [key,max]of Object.entries(limits)){const value=form.get(key);if(value!==null&&typeof value!=='string')return Response.json({error:'ফর্মের তথ্য সঠিক নয়।'},{status:400});values[key]=(value||'').toString().trim();if(values[key].length>max)return Response.json({error:'লেখা নির্ধারিত সীমার চেয়ে বড় হয়েছে।'},{status:400})}
  if(!values.name||!values.message||!values.event)return Response.json({error:'নাম, অনুষ্ঠানের নাম ও বার্তা লিখুন।'},{status:400});
  if(values.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(values.date)||Number.isNaN(Date.parse(values.date))||new Date(values.date).toISOString().slice(0,10)!==values.date))return Response.json({error:'অনুষ্ঠানের তারিখ সঠিক নয়।'},{status:400});
  if(values.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time))return Response.json({error:'অনুষ্ঠানের সময় সঠিক নয়।'},{status:400});
  let photoData='';const photo=form.get('photo');if(photo instanceof File&&photo.size){if(photo.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(photo.type))return Response.json({error:'৫ MB-এর মধ্যে JPG, PNG বা WebP ছবি দিন।'},{status:400});try{const input=Buffer.from(await photo.arrayBuffer());const meta=await sharp(input,{limitInputPixels:25000000}).metadata();if(!['jpeg','png','webp'].includes(meta.format||''))throw new Error();photoData=(await sharp(input,{limitInputPixels:25000000}).rotate().resize(640,640,{fit:'cover'}).jpeg({quality:82}).toBuffer()).toString('base64')}catch{return Response.json({error:'ছবিটি পড়া যায়নি। অন্য একটি ছবি দিন।'},{status:400})}}
  const result=await createCard({...values,photo:''} as Invitation,photoData);return Response.json(result,{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Card creation failed',error instanceof Error?error.message:'unknown');return Response.json({error:'কার্ডটি সংরক্ষণ হয়নি। আবার চেষ্টা করুন।'},{status:500})}
}


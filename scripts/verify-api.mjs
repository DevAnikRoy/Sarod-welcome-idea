import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
const base=process.env.TEST_BASE||'http://127.0.0.1:3002';
const created=[];
try{
 const portrait=await sharp({create:{width:640,height:640,channels:3,background:'#9f2526'}}).jpeg().toBuffer();
 await Promise.all(Array.from({length:5},async(_,index)=>{const form=new FormData();form.set('name',`পরীক্ষা ${index+1}`);form.set('recipient',`বন্ধু ${index+1}`);form.set('event','আমাদের দুর্গোৎসব');form.set('message',`ব্যক্তিগত আমন্ত্রণ ${index+1}`);form.set('venue','পরীক্ষার মণ্ডপ');form.set('date','2026-10-20');form.set('time','18:30');if(index===0)form.set('photo',new Blob([portrait],{type:'image/jpeg'}),'portrait.jpg');const response=await fetch(`${base}/api/cards`,{method:'POST',body:form,headers:{Origin:base}});assert.equal(response.status,201);const data=await response.json();created.push(data);assert.match(data.id,/^[a-f0-9]{32}$/);assert.match(data.token,/^[a-f0-9]{64}$/);const fetched=await (await fetch(`${base}/api/cards/${data.id}`)).json();assert.equal(fetched.name,`পরীক্ষা ${index+1}`);assert.equal(fetched.message,`ব্যক্তিগত আমন্ত্রণ ${index+1}`);assert.equal(fetched.ownerHash,undefined);assert.equal(fetched.token,undefined);assert.equal(fetched.photoData,undefined);const page=await fetch(`${base}/c/${data.id}`);assert.equal(page.status,200);assert.ok((await page.text()).includes(`পরীক্ষা ${index+1}`));if(index===0){const image=await fetch(`${base}${fetched.photo}`);assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/jpeg');const meta=await sharp(Buffer.from(await image.arrayBuffer())).metadata();assert.equal(meta.width,640);assert.equal(meta.exif,undefined)}}));
 assert.equal(new Set(created.map(c=>c.id)).size,5);
 const invalid=new FormData();invalid.set('name','');invalid.set('event','পূজা');invalid.set('message','টেস্ট');assert.equal((await fetch(`${base}/api/cards`,{method:'POST',body:invalid})).status,400);
 const corrupt=new FormData();corrupt.set('name','টেস্ট');corrupt.set('event','পূজা');corrupt.set('message','টেস্ট');corrupt.set('photo',new Blob(['not an image'],{type:'image/jpeg'}),'fake.jpg');assert.equal((await fetch(`${base}/api/cards`,{method:'POST',body:corrupt})).status,400);
 assert.equal((await fetch(`${base}/api/cards/${created[0].id}`,{method:'DELETE',headers:{Authorization:`Bearer ${'0'.repeat(64)}`}})).status,403);
 assert.equal((await fetch(`${base}/api/cards`,{method:'POST',headers:{Origin:'https://other.invalid'}})).status,403);
 console.log('PASS: 5 concurrent independent cards, public pages, resized photo, no metadata/secrets in public response, invalid input/image rejection, owner-only deletion, origin check.');
}finally{for(const card of created){const response=await fetch(`${base}/api/cards/${card.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${card.token}`}});assert.equal(response.status,200);assert.equal((await fetch(`${base}/api/cards/${card.id}`)).status,404);assert.equal((await fetch(`${base}/api/cards/${card.id}/photo`)).status,404)}}
console.log('PASS: test cards and photos removed; deleted links return 404.');


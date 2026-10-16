import {BlobsServer} from '@netlify/blobs/server';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const directory=await mkdtemp(path.join(process.cwd(),'.netlify-storage-test-'));
const blobs=new BlobsServer({directory,token:'local-test-only',logger:()=>{}});
const {port}=await blobs.start();
const endpoint=`http://127.0.0.1:${port}`;
const context=Buffer.from(JSON.stringify({siteID:'local-storage-test',token:'local-test-only',edgeURL:endpoint,uncachedEdgeURL:endpoint,apiURL:endpoint})).toString('base64');
const base='http://127.0.0.1:3002';let app;
const rawFetch=globalThis.fetch;const fetch=(url,options={})=>rawFetch(url,{...options,signal:AbortSignal.timeout(15000)});
const env={...process.env,NETLIFY_BLOBS_CONTEXT:context,CARD_STORAGE:'netlify',CARD_STORE_NAME:'isolated-test'};
async function start(){app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3002'],{env,stdio:['ignore','ignore','inherit']});for(let i=0;i<100;i++){try{const response=await fetch(base);if(response.ok)return}catch{}await new Promise(r=>setTimeout(r,200))}throw Error('test app not ready')}
async function stop(){if(!app||app.exitCode!==null)return;const ended=new Promise(r=>app.once('exit',r));app.kill();await ended}
try{
 await start();const checks=spawn(process.execPath,['scripts/verify-api.mjs'],{env:{...env,TEST_BASE:base},stdio:'inherit'});await new Promise((resolve,reject)=>{checks.once('exit',code=>code===0?resolve():reject(Error('API checks failed')));checks.once('error',reject)});
 const form=new FormData();form.set('name','স্থায়ী পরীক্ষার কার্ড');form.set('event','দুর্গোৎসব');form.set('message','নতুন server instance থেকেও একই কার্ড দেখা যাবে।');const created=await fetch(`${base}/api/cards`,{method:'POST',headers:{Origin:base},body:form});assert.equal(created.status,201);const card=await created.json();
 console.log('created cloud-backed card');await stop();await start();console.log('restarted app');const loaded=await fetch(`${base}/api/cards/${card.id}`);assert.equal(loaded.status,200);assert.equal((await loaded.json()).name,'স্থায়ী পরীক্ষার কার্ড');assert.equal((await fetch(`${base}/api/cards/${card.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${card.token}`,Origin:base}})).status,200);
 console.log('PASS: Netlify Blobs adapter persists invitations across independent server processes.');
}finally{await stop();await blobs.stop();if(directory.startsWith(path.join(process.cwd(),'.netlify-storage-test-')))await rm(directory,{recursive:true,force:true})}

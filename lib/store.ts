import {mkdir,readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {getStore} from '@netlify/blobs';
import type {Invitation} from './types';
export const dataDir = process.env.CARD_DATA_DIR || path.join(process.cwd(),'data','cards');
type Stored = Invitation & {id:string; photoData:string; ownerHash:string; createdAt:string};
const validId = /^[a-f0-9]{32}$/;
function valid(id:string){return validId.test(id)}
function filename(id:string){if(!valid(id))throw new Error('INVALID_ID');return path.join(dataDir,`${id}.json`)}
const hash=(token:string)=>createHash('sha256').update(token).digest();
function hosted(){return process.env.CARD_STORAGE==='netlify'||Boolean(process.env.NETLIFY_BLOBS_CONTEXT||process.env.NETLIFY||(globalThis as typeof globalThis & {netlifyBlobsContext?:unknown}).netlifyBlobsContext)}
function store(){return getStore({name:process.env.CARD_STORE_NAME||'shoroter-invitations-v1',consistency:'strong'})}
export async function readStored(id:string):Promise<Stored|null>{
 if(!valid(id))return null;
 if(hosted())return await store().get(id,{type:'json'}) as Stored|null;
 try{return JSON.parse(await readFile(filename(id),'utf8'))}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return null;throw error}
}
export function publicCard(card:Stored):Invitation{return {id:card.id,name:card.name,recipient:card.recipient,message:card.message,event:card.event,venue:card.venue,date:card.date,time:card.time,photo:card.photoData?`/api/cards/${card.id}/photo`:''}}
export async function createCard(card:Invitation,photoData:string){
 const id=randomBytes(16).toString('hex');const token=randomBytes(32).toString('hex');
 const stored:Stored={...card,id,photo:'',photoData,ownerHash:hash(token).toString('hex'),createdAt:new Date().toISOString()};
 if(hosted()){const result=await store().setJSON(id,stored,{onlyIfNew:true});if(!result.modified)throw new Error('CARD_ID_CONFLICT')}
 else{await mkdir(dataDir,{recursive:true});await writeFile(filename(id),JSON.stringify(stored),{flag:'wx',mode:0o600})}
 return {id,token,card:publicCard(stored)};
}
export async function deleteCard(id:string,token:string){
 const card=await readStored(id);if(!card)return 'missing';
 if(!/^[a-f0-9]{64}$/.test(token)||!timingSafeEqual(hash(token),Buffer.from(card.ownerHash,'hex')))return 'denied';
 if(hosted())await store().delete(id);
 else{try{await unlink(filename(id))}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return 'missing';throw error}}
 return 'deleted';
}

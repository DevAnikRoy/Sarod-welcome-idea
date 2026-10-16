import {readStored} from '../../../../../lib/store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const card=await readStored(id);if(!card?.photoData)return new Response(null,{status:404});return new Response(Buffer.from(card.photoData,'base64'),{headers:{'Content-Type':'image/jpeg','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'}})}

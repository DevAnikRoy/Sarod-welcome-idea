import {sameOrigin} from '../../../../lib/origin';
import {readStored,publicCard,deleteCard} from '../../../../lib/store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const stored=await readStored(id);return stored?Response.json(publicCard(stored),{headers:{'Cache-Control':'no-store'}}):Response.json({error:'কার্ডটি পাওয়া যায়নি।'},{status:404})}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){if(!sameOrigin(request))return new Response(null,{status:403});const {id}=await params;const token=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';const result=await deleteCard(id,token);return Response.json({result},{status:result==='deleted'?200:result==='missing'?404:403,headers:{'Cache-Control':'no-store'}})}


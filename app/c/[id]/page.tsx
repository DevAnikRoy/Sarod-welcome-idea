import {notFound} from 'next/navigation';
import {readStored,publicCard} from '../../../lib/store';
import Experience from '../../components/Experience';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const card=await readStored((await params).id);return {title:card?`${card.name}-এর শারদীয় আমন্ত্রণ | শরতের চিঠি`:'কার্ড পাওয়া যায়নি',robots:{index:false,follow:false}}}
export default async function CardPage({params}:{params:Promise<{id:string}>}){const stored=await readStored((await params).id);if(!stored)notFound();return <Experience card={publicCard(stored)} shared/>}

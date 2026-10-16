import type { Metadata } from 'next';
import './globals.css';
import './envelope.css';
export const metadata: Metadata = {title:'শরতের চিঠি — শারদীয় শুভেচ্ছা',description:'শরতের হাওয়ায়, আপনার জন্য একটি চিঠি। শারদীয় দুর্গোৎসবের আন্তরিক শুভেচ্ছা।'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="bn"><body>{children}</body></html>}

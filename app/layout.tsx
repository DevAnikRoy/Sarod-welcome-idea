import type { Metadata } from 'next';
import './globals.css';
import './envelope.css';
import './festival-theme.css';
export const metadata: Metadata = {title:'শরতের চিঠি — শারদীয় শুভেচ্ছা',description:'পরিবার ও বন্ধুদের জন্য নিজের নাম ও ছবি দিয়ে দুর্গাপুজোর আমন্ত্রণ তৈরি করুন।'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="bn"><body>{children}</body></html>}


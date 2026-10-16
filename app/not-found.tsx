import Link from 'next/link';
export default function NotFound(){return <main className="empty-page"><p className="eyebrow">শরতের চিঠি</p><h1>এই চিঠিটি পাওয়া গেল না।</h1><p>লিংকটি ভুল হতে পারে, অথবা মালিক কার্ডটি মুছে ফেলেছেন।</p><Link className="primary" href="/create">নিজের আমন্ত্রণ তৈরি করুন →</Link></main>}

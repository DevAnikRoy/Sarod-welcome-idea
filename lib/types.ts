export type Invitation = {
  id?: string; name: string; recipient: string; message: string;
  event: string; venue: string; date: string; time: string; photo: string;
};
export const presets = [
 'পুজোয় পরিবারের সবাইকে নিয়ে আসবেন। অনেক দিন একসঙ্গে বসে গল্প করা হয় না। এবার দেখা হোক। আপনাদের অপেক্ষায় রইলাম।',
 'আমাদের দুর্গাপুজোয় আপনাকে ও আপনার পরিবারকে আন্তরিক আমন্ত্রণ। সময় করে অবশ্যই আসবেন। আপনাদের সঙ্গে পুজোর আনন্দ ভাগ করে নিতে চাই।',
 'বন্ধু, এবার পুজোয় কিন্তু দেখা চাই। সবাই মিলে আড্ডা দেব, পুরোনো দিনের গল্প করব। পরিবারকেও সঙ্গে নিয়ে এসো।'
];
export const sample: Invitation = {name:'অনিক রায়',recipient:'প্রিয় বন্ধু',message:presets[0],event:'শারদীয় দুর্গোৎসব',venue:'',date:'',time:'',photo:''};
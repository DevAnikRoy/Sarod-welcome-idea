export type Invitation = {
  id?: string; name: string; recipient: string; message: string;
  event: string; venue: string; date: string; time: string; photo: string;
};
export const sample: Invitation = {name:'অনিক রায়',recipient:'প্রিয় আপনজন',message:'মায়ের আগমনে মুছে যাক সকল অন্ধকার। আনন্দে, ভালোবাসায় ও সম্প্রীতিতে ভরে উঠুক আপনার দিনগুলো।',event:'শারদীয় দুর্গোৎসব',venue:'',date:'',time:'',photo:''};
export const presets = ['মায়ের আগমনে মুছে যাক সকল অন্ধকার। আনন্দে, ভালোবাসায় ও সম্প্রীতিতে ভরে উঠুক আপনার দিনগুলো।','কাশফুলের শুভ্রতা আর প্রদীপের আলোয় ভরে উঠুক আপনার উৎসব। আমাদের পূজার আনন্দে আপনাকে সপরিবারে আমন্ত্রণ।','ঢাকের তালে, ধুনুচির নাচে—আবার দেখা হোক উৎসবের আঙিনায়। রইল সপরিবারে আসার আন্তরিক আমন্ত্রণ।'];

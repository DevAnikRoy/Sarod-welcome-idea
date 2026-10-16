import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
await mkdir('public/images',{recursive:true});
for(const [name,width]of [['kash',1600],['durga',1000],['diya',1000]]){await sharp(`public/images/${name}-original.jpg`).rotate().resize({width,withoutEnlargement:true}).webp({quality:84}).toFile(`public/images/${name}.webp`)}

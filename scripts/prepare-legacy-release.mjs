import {readFile,writeFile,mkdir,cp,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {shellPage} from './build-learning.mjs';

export async function prepareLegacyRelease(out) {
 const source=fileURLToPath(new URL('../',import.meta.url));
 const destination=resolve(out);
 if(destination===resolve(source)) throw Error('Use a separate release worktree');
 await stat(resolve(destination,'.git'));
 const files=['index.html','portal-data.json','README.md','video-submission.mjs','scripts/build-learning.mjs','scripts/prepare-legacy-release.mjs'];
 for(const file of files) { await mkdir(dirname(resolve(destination,file)),{recursive:true}); await cp(resolve(source,file),resolve(destination,file)); }
 // Source and approved docs are retained, but the new portal's generated routes are not published.
 for(const folder of ['assets','videos','content','docs']) await cp(resolve(source,folder),resolve(destination,folder),{recursive:true});
 const catalog=JSON.parse(await readFile(resolve(source,'content/learning-catalog.json'),'utf8'));
 await mkdir(resolve(destination,'basics'),{recursive:true});
 for(const theme of catalog.themes.filter(t=>t.ready===true)) {
   const body=await readFile(resolve(source,`content/${theme.id}-body.html`),'utf8');
   let page=shellPage(theme.title,[{title:'旧ポータル',href:'../index.html'},{title:theme.title}],{title:'旧ポータル',href:'../index.html'},body+'<a class="back bottom-back" href="../index.html">← 旧ポータルへ</a>');
   if(theme.id==='nippo-taiken') page=page.replace('</body>','<script type="module" src="../assets/daily-report.mjs"></script>\n</body>');
   await writeFile(resolve(destination,`basics/${theme.id}.html`),page);
 }
 console.log('Prepared legacy portal; new/index.html and category routes were not copied.');
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 if(!process.argv[2]) throw Error('Pass the destination worktree');
 await prepareLegacyRelease(process.argv[2]);
}

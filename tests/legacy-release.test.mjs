import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('legacy release publishes shared media and details without exposing new portal routes',async()=>{
 for(const missing of ['new/index.html','basics/index.html','basics/tasks.html','basics/lesson.html','basics/student.html']) await assert.rejects(access(new URL(missing,root)));
 for(const page of ['index.html','basics/nippo-taiken.html','basics/checkin.html','basics/taiken-taio.html']) {
  const html=await readFile(new URL(page,root),'utf8');
  for(const [,value] of html.matchAll(/(?:href|src|poster)="([^"#]+)"/g)) {
   if(/^https?:/.test(value)) continue;
   assert.ok((await stat(new URL(value,new URL(page,root)))).isFile(),page+': '+value);
  }
  if(page.startsWith('basics/')) {
   assert.match(html,/← 旧ポータルへ/);
   assert.doesNotMatch(html,/(?:href="(?:tasks|lesson|student)\.html|new\/index\.html)/);
  }
 }
 const data=JSON.parse(await readFile(new URL('portal-data.json',root),'utf8'));
 const today=data.categories.find(c=>c.id==='today').items;
 assert.equal(today[0].title,'【出欠】チェックイン-hacomono');
 assert.equal(today[1].id,'t-checkin-video');
 assert.equal(today.at(-1).id,'t-3-video');
 assert.ok(!today.some(i=>i.id==='t-3'));
 assert.equal(data.categories.find(c=>c.id==='manual').items[2].id,'m-taiken-taio-video');
 assert.equal(data.videoSubmission.tokyoEnabled,true);
 const legacy=await readFile(new URL('index.html',root),'utf8');
 assert.match(legacy,/data-system-guide/);
 assert.match(legacy,/videos\/lr-system-guide\.mp4/);
});

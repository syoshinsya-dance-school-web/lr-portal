import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {videoSubmissionItems,SAITAMA_VIDEO_URL} from '../video-submission.mjs';
const data=JSON.parse(await readFile(new URL('../portal-data.json',import.meta.url),'utf8'));
const today=data.categories.find(c=>c.id==='today');
test('checked-in setting keeps the exact existing form and other entries',()=>{
 assert.equal(data.videoSubmission.saitamaEnabled,false);
 assert.strictEqual(videoSubmissionItems(today.items,data.videoSubmission),today.items);
 for(const setting of [undefined,{},null,{saitamaEnabled:'true'},{saitamaEnabled:1}])assert.strictEqual(videoSubmissionItems(today.items,setting),today.items);
});
test('enabled setting splits only the existing video entry into production Saitama and the unchanged legacy form',()=>{
 const original=structuredClone(today.items),items=videoSubmissionItems(today.items,{saitamaEnabled:true});
 assert.equal(items.length,today.items.length+1);
 const saitama=items.find(i=>i.id==='t-2-saitama'),legacy=items.find(i=>i.id==='t-2');
 assert.equal(saitama.url,SAITAMA_VIDEO_URL);assert.equal(saitama.type,'link');
 assert.equal(legacy.url,original.find(i=>i.id==='t-2').url);assert.equal(legacy.type,'form');
 assert.deepEqual(items.filter(i=>!i.id.startsWith('t-2')),original.filter(i=>i.id!=='t-2'));
 assert.deepEqual(today.items,original);
 assert.ok(!items.some(i=>i.url.includes('dev-20260824')||i.url.includes('/_staging')||i.url.includes('/__ops')));
});
test('rollback restores the original one-button entry without routing existing or in-flight submissions',()=>{
 const active=videoSubmissionItems(today.items,{saitamaEnabled:true});assert.equal(active.filter(i=>i.id.startsWith('t-2')).length,2);
 const stopped=videoSubmissionItems(today.items,{saitamaEnabled:false});assert.strictEqual(stopped,today.items);
 assert.equal(stopped.filter(i=>i.id.startsWith('t-2')).length,1);
});

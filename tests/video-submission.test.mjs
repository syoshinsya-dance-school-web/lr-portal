import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {videoSubmissionItems,SAITAMA_VIDEO_URL} from '../video-submission.mjs';
const data=JSON.parse(await readFile(new URL('../portal-data.json',import.meta.url),'utf8'));
const today=data.categories.find(c=>c.id==='today');
test('published setting enables Saitama while disabled or invalid settings preserve the existing entries',()=>{
 assert.equal(data.videoSubmission.saitamaEnabled,true);
 assert.equal(data.videoSubmission.osakaEnabled,true);
 assert.strictEqual(videoSubmissionItems(today.items,{saitamaEnabled:false}),today.items);
 for(const setting of [undefined,{},null,{saitamaEnabled:'true'},{saitamaEnabled:1}])assert.strictEqual(videoSubmissionItems(today.items,setting),today.items);
});
test('published Osaka and Saitama entry uses the live selection portal and leaves every other card unchanged',()=>{
 const before=structuredClone(data),items=videoSubmissionItems(today.items,data.videoSubmission);
 assert.equal(items.find(i=>i.id==='t-2-saitama').title,'【提出】埼玉・大阪のレッスン動画');
 assert.match(items.find(i=>i.id==='t-2-saitama').desc,/Googleログイン不要/);
 assert.equal(items.find(i=>i.id==='t-2-saitama').url,SAITAMA_VIDEO_URL);
 const legacy=items.find(i=>i.id==='t-2');
 assert.equal(legacy.title,'【提出】その他の支部のレッスン動画');
 assert.match(legacy.desc,/埼玉・大阪以外/);
 assert.equal(legacy.url,today.items.find(i=>i.id==='t-2').url);
 assert.equal(legacy.type,'form');
 for(const category of data.categories.filter(c=>c.id!=='today'))assert.deepEqual(videoSubmissionItems(category.items,data.videoSubmission),category.items);
 assert.deepEqual(data,before);
});
test('Osaka rollback preserves Saitama and independently disabled branches remain on the original form',()=>{
 const saitama=videoSubmissionItems(today.items,{saitamaEnabled:true,osakaEnabled:false});
 assert.equal(saitama.find(i=>i.id==='t-2-saitama').title,'【提出】埼玉のレッスン動画');
 assert.match(saitama.find(i=>i.id==='t-2').desc,/埼玉以外/);
 const osaka=videoSubmissionItems(today.items,{saitamaEnabled:false,osakaEnabled:true});
 assert.equal(osaka.find(i=>i.id==='t-2-saitama').title,'【提出】大阪のレッスン動画');
 assert.match(osaka.find(i=>i.id==='t-2').desc,/大阪以外/);
 for(const osakaEnabled of [false,'true',1,[],{}])assert.strictEqual(videoSubmissionItems(today.items,{osakaEnabled}),today.items);
 assert.strictEqual(videoSubmissionItems(today.items,{saitamaEnabled:false,osakaEnabled:false}),today.items);
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

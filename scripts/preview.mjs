import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const enabled=process.argv.includes('--saitama');
const files={'/':'index.html','/index.html':'index.html','/portal-data.json':'portal-data.json','/video-submission.mjs':'video-submission.mjs'};
createServer(async(req,res)=>{
 const file=files[new URL(req.url,'http://127.0.0.1').pathname];
 if(!file||!['GET','HEAD'].includes(req.method)){res.writeHead(404);res.end();return;}
 try{
  let body=await readFile(new URL('../'+file,import.meta.url));
  if(file==='portal-data.json'&&enabled){const data=JSON.parse(body);data.videoSubmission={saitamaEnabled:true};body=Buffer.from(JSON.stringify(data));}
  res.writeHead(200,{'content-type':file.endsWith('.json')?'application/json; charset=utf-8':file.endsWith('.mjs')?'text/javascript; charset=utf-8':'text/html; charset=utf-8','cache-control':'no-store'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(500);res.end('Preview unavailable');}
}).listen(8794,'127.0.0.1',()=>console.log('Portal local preview: http://127.0.0.1:8794 (Saitama '+(enabled?'on':'off')+')'));

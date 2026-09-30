const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname; const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{const u=new URL(req.url,'http://x'); if(u.pathname==='/health'){res.writeHead(200,{'content-type':'text/plain'});return res.end('ok');}
let p=u.pathname==='/'?'/index.html':u.pathname; p=path.normalize(p).replace(/^([.][.][/\\])+/, ''); const f=path.join(root,p);
if(!f.startsWith(root)){res.writeHead(403);return res.end('forbidden');}
fs.readFile(f,(e,d)=>{if(e){res.writeHead(404,{'content-type':'text/plain'});return res.end('not found');}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'public,max-age=300'});res.end(d);});}).listen(process.env.PORT||3000,'0.0.0.0');
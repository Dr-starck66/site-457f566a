const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/health'){res.writeHead(200,{'content-type':'text/plain'});return res.end('ok');}
  let rel=u.pathname==='/'?'index.html':u.pathname.replace(/^\//,'');
  rel=path.normalize(rel);
  const file=path.join(root,rel);
  if(!file.startsWith(root)){res.writeHead(403);return res.end('forbidden');}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404,{'content-type':'text/plain'});return res.end('not found');}
    res.writeHead(200,{'content-type':types[path.extname(file)]||'text/html; charset=utf-8','cache-control':'public,max-age=300'});
    res.end(data);
  });
}).listen(Number(process.env.PORT)||3000,'0.0.0.0');
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const SITE = process.env.ASTRA_MEDIA_SITE || "tarija";
if(!["tarija","cibao"].includes(SITE))throw new Error("invalid ASTRA_MEDIA_SITE");
const root = path.resolve("restored", SITE);
let manifest={};
try{manifest=JSON.parse(await readFile(path.join(root,"_astra_status_manifest.json"),"utf8"))}catch{}
const gone=new Set(manifest.gone||[]);
const redirects=new Map((manifest.redirects||[]).map(x=>[x[0],{location:x[1],status:Number(x[2]||301)}]));
const MIME={".html":"text/html; charset=utf-8",".xml":"application/xml; charset=utf-8",".svg":"image/svg+xml",".txt":"text/plain; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".ico":"image/x-icon",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png",".webp":"image/webp"};
const server=createServer(async(req,res)=>{
 const send=(n,headers={},data="")=>{res.writeHead(n,{"x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin",...headers});res.end(req.method==="HEAD"?"":data)};
 if(req.method!=="GET" && req.method!=="HEAD")return send(405,{"allow":"GET, HEAD"});
 let u;
 try{u=new URL(req.url,"http://localhost")}catch{return send(400)}
 let pathname;
 try{pathname=decodeURIComponent(u.pathname)}catch{return send(400)}
 if(pathname.includes("\\") || pathname.split("/").includes("..") || pathname.includes("\x00"))return send(400);
 if(pathname==="/health")return send(200,{"content-type":"application/json"},JSON.stringify({ok:true,site:SITE,manifest:!!manifest.stats}));
 const redir=redirects.get(pathname);
 if(redir)return send(redir.status,{"location":redir.location});
 if(!pathname.endsWith("/")&&!path.extname(pathname))return send(301,{"location":pathname+"/"+u.search});
 const relative=pathname==="/"? "index.html" : pathname.endsWith("/")?pathname.slice(1)+"index.html":pathname.slice(1);
 const file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep))return send(400);
 const status=gone.has(pathname)?410:200;
 try{
  const s=await stat(file);if(!s.isFile())throw Error("not file");
  const data=await readFile(file);
  return send(status,{"content-type":MIME[path.extname(file)]||"application/octet-stream","cache-control":status===410?"public, max-age=300":path.extname(file)===".html"?"public, max-age=120":"public, max-age=600"},data);
 }catch{
  if(status===410)return send(410,{"content-type":"text/plain; charset=utf-8","x-robots-tag":"noindex"},"Recurso retirado (410 Gone)");
  try{return send(404,{"content-type":"text/html; charset=utf-8","x-robots-tag":"noindex"},await readFile(path.join(root,"404.html")))}catch{return send(404,{"content-type":"text/plain"},"Not Found")}
 }
});
const port=Number(process.env.PORT||10000);
server.listen(port,"0.0.0.0",()=>console.log("ASTRA_PUBLIC_RESCUE_READY",JSON.stringify({site:SITE,port,files:root,statusCodes:!!manifest.stats})));

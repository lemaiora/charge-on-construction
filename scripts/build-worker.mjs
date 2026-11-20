import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../',import.meta.url));
const pages = {};
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain'};
function collect(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) { collect(file); continue; }
    const url = '/' + path.relative(path.join(root,'site'),file);
    pages[url] = [mime[path.extname(file)],fs.readFileSync(file).toString('base64')];
  }
}
collect(path.join(root,'site'));
const handler = fs.readFileSync(path.join(root,'worker/inquiry.mjs'),'utf8');
const runtime = `
export default {async fetch(request,env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/inquiries') return handleInquiry(request,env);
  if (!['GET','HEAD'].includes(request.method)) return new Response(null,{status:405});
  let key = url.pathname;
  if (key.endsWith('/')) key += 'index.html';
  else if (Object.hasOwn(files,key+'/index.html')) {url.pathname += '/';return Response.redirect(url,308);}
  if (!Object.hasOwn(files,key)) return new Response('Page not found',{status:404});
  const [type,base64] = files[key];
  return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(base64), c=>c.charCodeAt(0)),{headers:{'Content-Type':type,'X-Content-Type-Options':'nosniff'}});
}};
`;
const out = path.join(root,'dist/server');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'index.js'),handler+'\nconst files='+JSON.stringify(pages)+';\n'+runtime);

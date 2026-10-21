import { mkdir, writeFile } from 'node:fs/promises';
const base = 'https://iphoneduowallpaper.com';
const out = 'reports/seo-2026-10-21';
await mkdir(out, {recursive:true});
const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const plain = s => decode(s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
async function get(url) {
  for(let attempt=0;attempt<2;attempt++) {
    try {const start=Date.now();const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(45000),headers:{'User-Agent':'Site SEO audit bot'}});const html=await r.text(); if(r.status>=500 && attempt===0) continue;return {status:r.status,location:r.headers.get('location'),ms:Date.now()-start,html};}
    catch(e) {if(attempt) return {status:0,error:e.message,html:''};}
  }
}
const sitemap=await get(base+'/sitemap.xml');
if(sitemap.status!==200 || !/<urlset\b/.test(sitemap.html)) {
  throw new Error(`Cannot audit sitemap: HTTP ${sitemap.status}${sitemap.error ? ` (${sitemap.error})` : ''}. Existing reports were preserved.`);
}
const urls=[...new Set([...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1])))];
if(!urls.length) throw new Error('Sitemap contains no URLs; refusing to produce an empty success report.');
await writeFile(out+'/sitemap.xml',sitemap.html);
const pages=[];let cursor=0;
async function worker(){while(cursor<urls.length){const url=urls[cursor++];const r=await get(url);const h=r.html;const main=/<main\b[^>]*>([\s\S]*?)<\/main>/.exec(h)?.[1]||h;
 const meta=name=>decode(new RegExp('<meta name="'+name+'" content="([^"]*)"').exec(h)?.[1]||'');
 const text=plain(main);
 pages.push({url,status:r.status,location:r.location,ms:r.ms,title:plain(/<title>([\s\S]*?)<\/title>/.exec(h)?.[1]||''),description:meta('description'),robots:meta('robots'),canonical:decode(/<link rel="canonical" href="([^"]+)"/.exec(h)?.[1]||''),h1:[...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>plain(m[1])),words:text.split(/\s+/).length,text,links:[...new Set([...main.matchAll(/href="([^"]+)"/g)].map(m=>decode(m[1])))],images:[...main.matchAll(/<img\b[^>]*>/g)].map(m=>({src:/src="([^"]+)"/.exec(m[0])?.[1],alt:/alt="([^"]*)"/.exec(m[0])?.[1]})),jsonld:[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1])}catch{return 'invalid'}}),adsense:/google-adsense-account" content="([^"]+)/.exec(h)?.[1],adScript:/pagead2.googlesyndication.com/.test(h)});
 if(pages.length%25===0)console.log(`${pages.length}/${urls.length}`);
}}
await Promise.all([worker(),worker()]);
pages.sort((a,b)=>a.url.localeCompare(b.url));
await writeFile(out+'/crawl.json',JSON.stringify(pages,null,2));
const duplicates={};for(const field of ['title','description']){const groups={};for(const p of pages){if(p[field]) (groups[p[field]]??=[]).push(p.url)}duplicates[field]=Object.entries(groups).filter(([,v])=>v.length>1)}
const summary={count:pages.length,statuses:pages.reduce((a,p)=>(a[p.status]=(a[p.status]||0)+1,a),{}),duplicates,missingCanonical:pages.filter(p=>!p.canonical).map(p=>p.url),canonicalMismatch:pages.filter(p=>p.canonical.replace(/\/$/,'')!==p.url.replace(/\/$/,'')).map(p=>({url:p.url,canonical:p.canonical})),noindex:pages.filter(p=>p.robots.includes('noindex')).map(p=>p.url),h1Issues:pages.filter(p=>p.h1.length!==1).map(p=>p.url),missingAlt:pages.filter(p=>p.images.some(i=>i.alt===undefined)).map(p=>p.url)};
await writeFile(out+'/summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
for(const path of ['/robots.txt','/ads.txt','/image-sitemap.xml','/search?q=blue','/wallpapers?page=2','/seo-audit-missing-page-20261021']){const r=await get(base+path);await writeFile(out+'/'+path.split('?')[0].replaceAll('/','_')+'.txt',r.html);console.log(JSON.stringify({path,status:r.status,location:r.location}));}

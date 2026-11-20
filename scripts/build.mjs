import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/content.json'), 'utf8'));
const scopes = data.services;
const images = data.images;
const descriptions = {
  hero: 'Sunlight across an open living room and its glazed garden wall',
  exterior: 'Sheltered entrance beneath a broad flat roof',
  detail: 'Built-in oak shelves beside a plaster arch',
  interior: 'Timber ceiling and stone fireplace in a garden-facing room',
  exterior2: 'Low building framed by trees and lawn',
  renovation: 'Staircase, arched opening and flush timber shelves',
  light: 'Open kitchen and sitting area in afternoon light',
  entry: 'Glass and timber entry beside a gravel drive',
  joinery: 'Slatted timber panel beside recessed display shelves'
};
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[char]);
const routes = {Work:'/projects/', Ethos:'/approach/', Practice:'/about/', 'Scope List':'/services/', 'Project Inquiry':'/estimate/'};
const scopeUrl = scope => '/projects/' + scope.slug + '/';
const link = (label, url = routes[label]) => `<a href="${url}">${escape(label)}</a>`;
const nav = Object.keys(routes).slice(0,3).map(label => link(label)).join('');
const brand = '<a class="brand" href="/" aria-label="Charge-On Construction home">Charge-On <span>Construction</span></a>';
const header = home => `<header class="mast ${home?'opening':''}">${brand}<nav aria-label="Primary">${nav}</nav><button class="dots" aria-label="Open menu" aria-controls="directory" aria-expanded="false"><i></i><i></i><i></i></button></header>
<dialog id="directory"><div class="menu-top">${brand}<button class="close" aria-label="Close menu">×</button></div><nav aria-label="Site directory">${Object.keys(routes).map(label=>link(label)).join('')}</nav><p>Orlando · Winter Park · Sanford</p></dialog>`;
const footer = `<footer><div>${brand}<p>Orlando, Winter Park, Sanford &amp; Central Florida</p></div><div>${link('Project Inquiry')}<a href="mailto:${data.email}">${data.email}</a></div><small>Architectural illustrations throughout. Completed projects are not pictured.</small><small>© Charge-On Construction LLC</small></footer>`;
function photo(key, eager = false) {
  return `<img src="/assets/images/${images[key]}" alt="${descriptions[key]}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async">`;
}
const card = (key, title, url, subtitle = '', eager = false) => `<a class="plate" href="${url}" aria-label="${escape(title)}"><figure>${photo(key,eager)}<figcaption>${escape(title)} ${subtitle?`<span>${escape(subtitle)}</span>`:''}</figcaption></figure></a>`;
const keys = ['exterior2','interior','renovation','detail'];
const scopeCard = (i,eager=false) => card(keys[i],scopes[i].title,scopeUrl(scopes[i]),'Scope of work',eager);
const home = `<h1 class="sr">Charge-On Construction</h1><div class="hero">${photo('hero',true)}</div>
<p class="statement">Construction and interiors throughout Central Florida.</p>
<div class="journal"><div class="solo">${scopeCard(1)}</div><div class="duo">${scopeCard(0)}${card('joinery','Ethos',routes.Ethos)}</div>
<div class="solo left">${scopeCard(2)}</div><div class="duo reverse">${card('entry','Practice',routes.Practice)}${scopeCard(3)}</div></div><p class="more">${link('View all work',routes.Work)}</p>`;
const switcher = active => `<nav class="switcher" aria-label="Work views"><a href="/projects/" ${active==='gallery'?'aria-current="page"':''}>Featured</a><a href="/services/" ${active==='list'?'aria-current="page"':''}>Scope List</a></nav>`;
const work = `<section class="work-head"><h1>Work</h1>${switcher('gallery')}</section><div class="work-grid">${scopes.map((s,i)=>scopeCard(i,i<2)).join('')}</div>`;
const list = `<section class="work-head"><h1>Scope List</h1>${switcher('list')}</section><section class="register" aria-label="Construction services">${scopes.map(s=>`<a href="${scopeUrl(s)}"><h2>${escape(s.title)}</h2><span>${escape(s.specialty)}</span><span>Central Florida</span><span>View scope</span></a>`).join('')}</section>`;
const detailImages = [['entry','exterior'],['light','joinery'],['interior','detail'],['joinery','renovation']];
function detail(s,i) {
 const next=scopes[(i+1)%scopes.length];
 return `<div class="detail-hero">${photo(keys[i],true)}<div class="detail-head"><h1>${escape(s.title)}</h1><span>Central Florida</span></div></div><section class="spread"><h2>Scope of work</h2><p>${escape(s.description)}</p></section><div class="gallery-pair">${detailImages[i].map(k=>photo(k)).join('')}</div><div class="detail-links">${link('Scope List')}${link(next.title,scopeUrl(next))}</div>`;
}
const ethosPanels = [
  ['renovation','Each scope begins with the existing space.'],
  ['light','Framing gives the room its proportions.'],
  ['joinery','The finish is in the joinery.']
];
const ethos = `<h1 class="sr">Ethos</h1><div class="ethos">${ethosPanels.map(([key,title],i)=>`<section id="panel-${i+1}">${photo(key,i===0)}<h2>${title}</h2><a class="advance" href="${i===2?'#ethos-end':'#panel-'+(i+2)}" aria-label="Continue down the page">⌄</a></section>`).join('')}<nav class="markers" aria-label="Approach sections">${ethosPanels.map(([,t],i)=>`<a href="#panel-${i+1}" aria-label="${t}"></a>`).join('')}</nav></div><div id="ethos-end" class="more">${link('Explore the work',routes.Work)}</div>`;
const practice = `<h1 class="sr">Practice</h1><nav class="switcher" aria-label="Practice sections"><a href="#services">Services</a><a href="#company">About</a><a href="/estimate/">Contact</a></nav><div id="services" class="practice-cards">${scopes.map((s,i)=>scopeCard(i,true)).join('')}</div><section id="company" class="spread"><h2>Charge-On Construction</h2><div><p>Charge-On Construction is a Central Florida contractor established in 2022. The company handles commercial build-outs, custom-home interiors, renovations and finish carpentry.</p><p class="member">Dmitry Naumets · LLC member</p></div></section><div class="practice-grid"><figure>${photo('entry')}</figure><div><h2>Service area</h2><p>Orlando, Winter Park, Sanford<br>and surrounding Central Florida.</p>${link('Project Inquiry')}</div></div>`;
const inquiry = `<section class="inquiry"><div><h1>Project Inquiry</h1><p>Tell the team where the work is planned, what needs to change, and when you hope to begin. Include any existing finishes that need to stay.</p><a href="mailto:${data.email}">${data.email}</a></div><form id="inquiry" action="https://charge-on-architectural-review.imagery-04canine.chatgpt.site/api/inquiries" method="post"><label>Full name<input name="Name" autocomplete="name" required></label><label>Email<input name="Email" type="email" autocomplete="email" required></label><label>Phone (optional)<input name="Phone" type="tel" autocomplete="tel"></label><label>Project location<input name="Location" required></label><label>Scope of work<select name="Scope"><option>General inquiry</option>${scopes.map(s=>`<option>${escape(s.title)}</option>`).join('')}</select></label><label>Preferred timeframe<input name="Timeframe"></label><label>Project details<textarea name="Details" rows="4" required></textarea></label><label hidden>Website<input name="website" tabindex="-1" autocomplete="off"></label><button type="submit">Send inquiry</button><p role="status" aria-live="polite"></p></form></section>`;
function page(url,title,body,homePage=false) {
 const local = path.relative(url.slice(1),'.') || '.';
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${escape(data.intro)}"><title>${escape(title)} | Charge-On Construction</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/css/style.css"><script defer src="/assets/js/main.js"></script></head><body class="${homePage?'home':(url===routes.Ethos||scopes.some(s=>scopeUrl(s)===url)?'immersive':'')}"><a class="skip" href="#main">Skip to content</a>${header(homePage)}<main id="main">${body}</main>${footer}</body></html>`;
 const dir=path.join(root,'site',url);
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'index.html'),html.replace(/(href|src)="\//g,`$1="${local}/`));
}
page('/','Construction & interiors',home,true);
page(routes.Work,'Work',work);
page(routes['Scope List'],'Scope List',list);
scopes.forEach((s,i)=>page(scopeUrl(s),s.title,detail(s,i)));
page(routes.Ethos,'Ethos',ethos);
page(routes.Practice,'Practice',practice);
page(routes['Project Inquiry'],'Project Inquiry',inquiry);
page('/projects/template/','Work',work);
page('/thank-you/','Inquiry received',`<section class="page-title"><h1>Inquiry received</h1><p>Thank you for sharing your project details.</p><p>${link('Return home','/')}</p></section>`);

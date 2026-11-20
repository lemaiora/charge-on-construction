const fields = ['Name','Email','Phone','Location','Scope','Timeframe','Details'];
const required = ['Name','Email','Location','Details'];
const limits = [160,254,80,300,120,180,6000];

export async function handleInquiry(request, env) {
  const wantsJSON = request.headers.get('Accept')?.includes('application/json');
  const reply = (status,message) => wantsJSON
    ? Response.json({message},{status,headers:{'Cache-Control':'no-store'}})
    : new Response(message,{status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
  if (request.method !== 'POST') return reply(405,'Use the project inquiry form.');
  if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return reply(415,'Unsupported form format.');
  if (Number(request.headers.get('content-length')) > 65536) return reply(413,'Please shorten the project details.');
  const raw = await request.text();
  if (raw.length > 65536) return reply(413,'Please shorten the project details.');
  const form = new URLSearchParams(raw);
  const values = fields.map(key => (form.get(key) || '').trim());
  if (form.get('website')) return reply(400,'Please use the project inquiry form.');
  if (required.some(key => !values[fields.indexOf(key)]) || values.some((v,i)=>v.length > limits[i]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[1]))
    return reply(422,'Check the required fields and email address, then try again.');
  const id = form.get('request_id') || crypto.randomUUID();
  if (!/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(id)) return reply(422,'Reload the inquiry form and try again.');
  try {
    await env.DB.prepare('INSERT INTO project_inquiries (id,name,email,phone,location,scope,timeframe,details) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,...values).run();
  } catch {
    return reply(503,'Your inquiry could not be saved. Please try again or email the team directly.');
  }
  return wantsJSON ? reply(201,'Your project inquiry has been received.') : Response.redirect(new URL('/thank-you/',request.url),303);
}

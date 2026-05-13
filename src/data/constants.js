export const T = {
  bg:       '#09090b',
  surface:  '#111113',
  card:     '#18181b',
  border:   '#27272a',
  borderLt: '#3f3f46',
  muted:    '#52525b',
  sub:      '#a1a1aa',
  text:     '#fafafa',
  textDim:  '#d4d4d8',
  accent:   '#10b981',   // emerald-500
  accentDim:'#064e3b',
  accentLt: '#34d399',
  red:      '#f87171',
  redDim:   '#450a0a',
  amber:    '#fbbf24',
  amberDim: '#451a03',
  blue:     '#60a5fa',
  blueDim:  '#172554',
};

// DEPRECATED: These exports are maintained for backward compatibility during PR 1.
// They will be removed in PR 2 when components are updated to use database APIs.
// DO NOT use these in new code.
export const USERS = {
  juan: { name: 'Juan', avatar: 'J', color: '#818cf8' },
  mile: { name: 'Mile', avatar: 'M', color: '#f472b6' },
};

export const CATEGORIES = [
  {cat:'Supermercado', emoji:'🛒'}, {cat:'Delivery',emoji:'🍕'},
  {cat:'Nafta',emoji:'⛽'}, {cat:'Alquiler',emoji:'🏠'},
  {cat:'Salud',emoji:'💊'}, {cat:'Café',emoji:'☕'},
  {cat:'Ropa',emoji:'👕'}, {cat:'Entretenimiento',emoji:'🎬'},
  {cat:'Transporte',emoji:'🚇'}, {cat:'Otro',emoji:'📦'},
];

export const INIT_FEED = [
  { id:1, user:'mile', emoji:'🛒', cat:'Supermercado', desc:'Coto — compras semana', amount:18400, shared:true, ts: new Date(Date.now()-1000*60*30) },
  { id:2, user:'juan', emoji:'🍕', cat:'Delivery', desc:'Pedidos Ya — pizza noche', amount:9800, shared:true, ts: new Date(Date.now()-1000*60*60*3) },
  { id:3, user:'mile', emoji:'💊', cat:'Farmacia', desc:'Farmacity', amount:4200, shared:false, ts: new Date(Date.now()-1000*60*60*8) },
  { id:4, user:'juan', emoji:'⛽', cat:'Nafta', desc:'Shell autopista', amount:22000, shared:true, ts: new Date(Date.now()-1000*60*60*26) },
  { id:5, user:'mile', emoji:'☕', cat:'Café', desc:'Starbucks Palermo', amount:3600, shared:false, ts: new Date(Date.now()-1000*60*60*30) },
  { id:6, user:'juan', emoji:'🏠', cat:'Alquiler', desc:'Alquiler junio', amount:180000, shared:true, ts: new Date(Date.now()-1000*60*60*48) },
];

export const INIT_GOALS = [
  { id:1, name:'Viaje a Bariloche', emoji:'🏔️', target:800000, current:320000, color:'#818cf8' },
  { id:2, name:'Smart TV nueva', emoji:'📺', target:250000, current:190000, color:'#f472b6' },
  { id:3, name:'Fondo emergencias', emoji:'🛡️', target:500000, current:85000, color:'#fbbf24' },
];

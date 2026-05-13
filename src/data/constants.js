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

// DEPRECATED: USERS and CATEGORIES are kept for PR 2 because components still import them.
// They will be removed in PR 3 when components are updated to receive these via props.
// App.jsx now passes users/categories as props; components need to be updated to use them.
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

// INIT_GOALS is temporarily kept for PR 2 seeding.
// It will be removed in PR 3 when goals are fully migrated to database-driven.
export const INIT_GOALS = [
  { id:1, name:'Viaje a Bariloche', emoji:'🏔️', target:800000, current:320000, color:'#818cf8' },
  { id:2, name:'Smart TV nueva', emoji:'📺', target:250000, current:190000, color:'#f472b6' },
  { id:3, name:'Fondo emergencias', emoji:'🛡️', target:500000, current:85000, color:'#fbbf24' },
];

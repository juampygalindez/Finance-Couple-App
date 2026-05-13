import React from 'react';
import { T, USERS, CATEGORIES } from '../data/constants';
import { fmt } from '../utils/format';
import Icon from './Icon';
import Avatar from './Avatar';

const Stats = ({ feed }) => {
  const cats = {};
  feed.filter(f=>f.shared).forEach(f => { cats[f.cat] = (cats[f.cat]||0)+f.amount; });
  const sorted = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const max = sorted[0]?.[1] || 1;
  const colors = ['#818cf8','#f472b6','#34d399','#fbbf24','#60a5fa','#fb923c'];
  const total = sorted.reduce((a,b)=>a+b[1],0);

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:90 }}>
      <div style={{ padding:'16px 20px 8px' }}>
        <p style={{ fontSize:11, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600 }}>Estadísticas</p>
        <p style={{ fontSize:20, fontWeight:700, color:T.text, marginTop:2 }}>Insights</p>
      </div>

      {/* Spotify Wrapped-style card */}
      <div style={{ margin:'8px 16px 0', background:'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border:`1px solid #818cf844`, borderRadius:20, padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <Icon name="sparkle" size={16} color='#818cf8'/>
          <p style={{ fontSize:11, color:'#818cf8', fontWeight:700, letterSpacing:.8, textTransform:'uppercase' }}>Cita Financiera · Abril</p>
        </div>
        <p style={{ fontSize:17, fontWeight:600, color:T.text, lineHeight:1.5 }}>
          "Este mes gastaron <span style={{color:'#f472b6'}}>{fmt(total)}</span> juntos. El delivery es su debilidad — ya van el <span style={{color:'#fbbf24'}}>3er mes seguido</span> arriba en esa categoría."
        </p>
        <p style={{ fontSize:12, color:T.sub, marginTop:10 }}>— Tu IA financiera 🤖</p>
      </div>

      {/* Category bars */}
      <div style={{ margin:'16px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'18px' }}>
        <p style={{ fontSize:12, color:T.muted, letterSpacing:.6, fontWeight:600, textTransform:'uppercase', marginBottom:14 }}>Gastos compartidos</p>
        {sorted.map(([cat, amount], i) => {
          const emoji = CATEGORIES.find(c=>c.cat===cat)?.emoji || '📦';
          return (
            <div key={cat} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.textDim, display:'flex', alignItems:'center', gap:6 }}>
                  <span>{emoji}</span>{cat}
                </span>
                <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{fmt(amount)}</span>
              </div>
              <div style={{ height:6, background:'#ffffff08', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${amount/max*100}%`, background:colors[i%colors.length], borderRadius:99, transition:'width .8s cubic-bezier(.4,0,.2,1)' }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split summary */}
      <div style={{ margin:'12px 16px 0', display:'flex', gap:10 }}>
        {Object.entries(USERS).map(([key, u]) => {
          const paid = feed.filter(f=>f.user===key&&f.shared).reduce((a,b)=>a+b.amount,0);
          return (
            <div key={key} style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:'14px' }}>
              <Avatar user={key} size={28}/>
              <p style={{ fontSize:12, color:T.sub, marginTop:8 }}>{u.name} aportó</p>
              <p style={{ fontSize:18, fontWeight:700, color:u.color, marginTop:2 }}>{fmt(paid)}</p>
              <p style={{ fontSize:11, color:T.muted, marginTop:2 }}>{total ? Math.round(paid/total*100) : 0}% del total</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;

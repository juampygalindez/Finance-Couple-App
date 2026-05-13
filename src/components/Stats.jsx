import React from 'react';
import { T } from '../data/constants';
import { fmt } from '../utils/format';
import Icon from './Icon';
import Avatar from './Avatar';

const Stats = ({ feed, users, categories }) => {
  const cats = {};
  feed.filter(f=>f.shared).forEach(f => { cats[f.cat] = (cats[f.cat]||0)+f.amount; });
  const sorted = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const max = sorted[0]?.[1] || 1;
  const colors = ['#818cf8','#f472b6','#34d399','#fbbf24','#60a5fa','#fb923c'];
  const total = sorted.reduce((a,b)=>a+b[1],0);

  // Real statistics
  const totalTransactions = feed.length;
  const sharedTransactions = feed.filter(f => f.shared).length;
  const personalTransactions = totalTransactions - sharedTransactions;
  const avgTransaction = totalTransactions > 0 ? feed.reduce((a,b) => a + b.amount, 0) / totalTransactions : 0;
  const totalSpent = feed.reduce((a,b) => a + b.amount, 0);

  // Get category color from categories prop
  const getCategoryColor = (catName) => {
    const catIndex = categories.findIndex(c => c.name === catName);
    return colors[catIndex % colors.length] || colors[0];
  };

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:90 }}>
      <div style={{ padding:'16px 20px 8px' }}>
        <p style={{ fontSize:11, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600 }}>Estadísticas</p>
        <p style={{ fontSize:20, fontWeight:700, color:T.text, marginTop:2 }}>Resumen</p>
      </div>

      {/* Summary stats card */}
      <div style={{ margin:'8px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <Icon name="sparkle" size={16} color={T.accent}/>
          <p style={{ fontSize:11, color:T.accent, fontWeight:700, letterSpacing:.8, textTransform:'uppercase' }}>Resumen del período</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <p style={{ fontSize:12, color:T.sub }}>Total gastado</p>
            <p style={{ fontSize:22, fontWeight:700, color:T.text, marginTop:4 }}>{fmt(totalSpent)}</p>
          </div>
          <div>
            <p style={{ fontSize:12, color:T.sub }}>Transacciones</p>
            <p style={{ fontSize:22, fontWeight:700, color:T.text, marginTop:4 }}>{totalTransactions}</p>
          </div>
          <div>
            <p style={{ fontSize:12, color:T.sub }}>Promedio por gasto</p>
            <p style={{ fontSize:22, fontWeight:700, color:T.text, marginTop:4 }}>{fmt(avgTransaction)}</p>
          </div>
          <div>
            <p style={{ fontSize:12, color:T.sub }}>Compartidos</p>
            <p style={{ fontSize:22, fontWeight:700, color:T.text, marginTop:4 }}>{sharedTransactions}</p>
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ margin:'16px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'18px' }}>
        <p style={{ fontSize:12, color:T.muted, letterSpacing:.6, fontWeight:600, textTransform:'uppercase', marginBottom:14 }}>Gastos compartidos por categoría</p>
        {sorted.map(([cat, amount], i) => {
          const category = categories.find(c=>c.name===cat);
          const emoji = category?.emoji || '📦';
          const color = getCategoryColor(cat);
          return (
            <div key={cat} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:13, color:T.textDim, display:'flex', alignItems:'center', gap:6 }}>
                  <span>{emoji}</span>{cat}
                </span>
                <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{fmt(amount)}</span>
              </div>
              <div style={{ height:6, background:'#ffffff08', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${amount/max*100}%`, background:color, borderRadius:99, transition:'width .8s cubic-bezier(.4,0,.2,1)' }}/>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p style={{ fontSize:14, color:T.sub, textAlign:'center', padding:'20px 0' }}>
            No hay gastos compartidos registrados
          </p>
        )}
      </div>

      {/* Split summary */}
      <div style={{ margin:'12px 16px 0', display:'flex', gap:10 }}>
        {users.map((u) => {
          const paid = feed.filter(f=>f.user===u.key&&f.shared).reduce((a,b)=>a+b.amount,0);
          return (
            <div key={u.key} style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:'14px' }}>
              <Avatar user={u.key} size={28}/>
              <p style={{ fontSize:12, color:T.sub, marginTop:8 }}>{u.name} aportó</p>
              <p style={{ fontSize:18, fontWeight:700, color:u.color, marginTop:2 }}>{fmt(paid)}</p>
              <p style={{ fontSize:11, color:T.muted, marginTop:2 }}>{total ? Math.round(paid/total*100) : 0}% del total compartido</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;

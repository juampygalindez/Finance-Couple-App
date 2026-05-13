import React from 'react';
import { T } from '../data/constants';
import { fmt, timeAgo } from '../utils/format';
import Icon from './Icon';

const Dashboard = ({ users, budget, feed, setFeed, setShowAdd, setDetailTx }) => {
  // Convert users array to lookup object for easy access
  const usersMap = React.useMemo(() => {
    return Object.fromEntries(users.map(u => [u.key, u]));
  }, [users]);

  const juanPaid = feed.filter(f=>f.user==='juan'&&f.shared).reduce((a,b)=>a+b.amount,0);
  const milePaid = feed.filter(f=>f.user==='mile'&&f.shared).reduce((a,b)=>a+b.amount,0);
  const diff = juanPaid - milePaid;
  const total = juanPaid + milePaid;
  const budgetAmount = budget ?? 500000;

  // Dynamic month label
  const monthLabel = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  // Capitalize first letter
  const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:90 }}>
      {/* HEADER */}
      <div style={{ padding:'16px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600 }}>{capitalizedMonthLabel}</p>
          <p style={{ fontSize:20, fontWeight:700, color:T.text, marginTop:2 }}>Pareja$</p>
        </div>
        <button style={{ background:'none', border:`1px solid ${T.border}`, borderRadius:10, padding:'6px 10px', color:T.sub, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="bell" size={14} color={T.sub}/>
          {feed.length}
        </button>
      </div>

      {/* BALANCE CARD */}
      <div style={{ margin:'16px 16px 0', background: diff===0 ? T.accentDim : diff>0 ? '#1e1b4b' : '#1c1917', border:`1px solid ${diff===0?T.accent+'44':diff>0?'#818cf844':'#f4724444'}`, borderRadius:20, padding:'20px 20px 18px' }}>
        <p style={{ fontSize:11, color:T.sub, letterSpacing:.6, textTransform:'uppercase', fontWeight:600, marginBottom:8 }}>Balance compartido</p>
        {diff === 0
          ? <p style={{ fontSize:22, fontWeight:700, color:T.accent }}>¡Están al día! 🎉</p>
          : <div>
              <p style={{ fontSize:22, fontWeight:700, color: diff>0 ? '#818cf8' : '#f87171' }}>
                {diff > 0 ? 'Mile' : 'Juan'} le debe {fmt(Math.abs(diff))}
              </p>
              <p style={{ fontSize:13, color:T.sub, marginTop:4 }}>
                a {diff > 0 ? 'Juan' : 'Mile'} este mes
              </p>
            </div>
        }
        <div style={{ marginTop:16, display:'flex', gap:8 }}>
          <div style={{ flex:1, background:'#ffffff08', borderRadius:12, padding:'10px 12px' }}>
            <p style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>Juan pagó</p>
            <p style={{ fontSize:16, fontWeight:700, color:usersMap.juan?.color || '#818cf8' }}>{fmt(juanPaid)}</p>
          </div>
          <div style={{ flex:1, background:'#ffffff08', borderRadius:12, padding:'10px 12px' }}>
            <p style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>Mile pagó</p>
            <p style={{ fontSize:16, fontWeight:700, color:usersMap.mile?.color || '#f472b6' }}>{fmt(milePaid)}</p>
          </div>
        </div>
        {/* budget bar */}
        <div style={{ marginTop:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:11, color:T.sub }}>Presupuesto mensual</span>
            <span style={{ fontSize:11, color:T.sub }}>{Math.round(total/budgetAmount*100)}% — {fmt(total)} de {fmt(budgetAmount)}</span>
          </div>
          <div style={{ height:5, background:'#ffffff10', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${Math.min(100,total/budgetAmount*100)}%`, background: total/budgetAmount > .8 ? T.red : T.accent, borderRadius:99, transition:'width .6s' }}/>
          </div>
          {total/budgetAmount > .8 && <p style={{ fontSize:10, color:T.red, marginTop:5 }}>⚠ Ya gastaron el {Math.round(total/budgetAmount*100)}% del presupuesto</p>}
        </div>
      </div>

      {/* QUICK ACTION — Te Toca */}
      <div style={{ margin:'12px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}
        onClick={() => alert(`Modos:\n• Al día: cualquiera puede pagar\n• Juan pagó: ${fmt(juanPaid)}\n• Mile pagó: ${fmt(milePaid)}\n\n👉 Le toca pagar a ${milePaid < juanPaid ? 'Mile' : 'Juan'} la próxima salida para equilibrar.`)}>
        <div style={{ width:40, height:40, borderRadius:12, background:T.amberDim, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:20 }}>🍽️</span>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:600, color:T.text }}>¿A quién le toca pagar?</p>
          <p style={{ fontSize:11, color:T.sub, marginTop:2 }}>Para cuando viene la cuenta</p>
        </div>
        <Icon name="arrow" size={16} color={T.muted}/>
      </div>

      {/* ACTIVITY FEED */}
      <div style={{ margin:'20px 16px 0' }}>
        <p style={{ fontSize:12, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600, marginBottom:12 }}>Actividad reciente</p>
        {feed.map((tx, i) => (
          <div key={tx.id} onClick={() => setDetailTx(tx)} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 0',
            borderBottom: i < feed.length-1 ? `1px solid ${T.border}` : 'none',
            cursor:'pointer',
          }}>
            <div style={{ width:42, height:42, borderRadius:13, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
              {tx.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <p style={{ fontSize:14, fontWeight:500, color:T.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{tx.desc}</p>
                {tx.shared && <span style={{ fontSize:9, background:T.accentDim, color:T.accentLt, borderRadius:4, padding:'2px 5px', fontWeight:600, letterSpacing:.4, flexShrink:0 }}>COMPARTIDO</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: (usersMap[tx.user]?.color || '#999') + '22',
                  border: `1.5px solid ${(usersMap[tx.user]?.color || '#999')}44`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 6, color: usersMap[tx.user]?.color || '#999', fontWeight: 600, flexShrink: 0,
                }}>{usersMap[tx.user]?.initial || '?'}</div>
                <span style={{ fontSize:11, color:T.sub }}>{usersMap[tx.user]?.name || tx.user} · {timeAgo(tx.ts)}</span>
              </div>
            </div>
            <p style={{ fontSize:15, fontWeight:600, color:T.text, flexShrink:0 }}>{fmt(tx.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { T, USERS } from '../data/constants';
import { fmt, timeAgo } from '../utils/format';

const DetailModal = ({ tx, onClose }) => {
  if (!tx) return null;
  const u = USERS[tx.user];
  return (
    <div style={{ position:'absolute', inset:0, zIndex:300, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'#00000088' }}/>
      <div style={{ position:'relative', background:T.surface, borderRadius:'24px 24px 0 0', border:`1px solid ${T.border}`, borderBottom:'none', padding:'8px 20px 40px' }}>
        <div style={{ width:36, height:4, background:T.border, borderRadius:99, margin:'8px auto 24px' }}/>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 12px' }}>{tx.emoji}</div>
          <p style={{ fontSize:28, fontWeight:700, color:T.text }}>{fmt(tx.amount)}</p>
          <p style={{ fontSize:15, color:T.sub, marginTop:4 }}>{tx.desc}</p>
        </div>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, overflow:'hidden' }}>
          {[
            ['Categoría', tx.cat],
            ['Pagó', u.name],
            ['Tipo', tx.shared ? 'Gasto compartido' : 'Gasto personal'],
            ['Cuándo', timeAgo(tx.ts)],
          ].map(([k,v],i,arr) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom: i<arr.length-1 ? `1px solid ${T.border}` : 'none' }}>
              <span style={{ fontSize:14, color:T.sub }}>{k}</span>
              <span style={{ fontSize:14, fontWeight:500, color:T.text }}>{v}</span>
            </div>
          ))}
        </div>
        {tx.shared && <button style={{ width:'100%', marginTop:12, background:T.accentDim, border:`1px solid ${T.accent}44`, borderRadius:14, padding:'14px', color:T.accent, fontSize:14, fontWeight:600, cursor:'pointer' }}>
          Marcar como saldado
        </button>}
      </div>
    </div>
  );
};

export default DetailModal;

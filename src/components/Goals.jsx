import React, { useState } from 'react';
import { T } from '../data/constants';
import { fmt } from '../utils/format';
import Confetti from './Confetti';
import Icon from './Icon';

const Goals = ({ goals, onUpdateGoal }) => {
  const [celebrating, setCelebrating] = useState(null);
  const add = (id, amount) => {
    onUpdateGoal(id, amount);
    setCelebrating(id);
    setTimeout(() => setCelebrating(null), 1500);
  };
  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:90 }}>
      <div style={{ padding:'16px 20px 8px' }}>
        <p style={{ fontSize:11, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600 }}>Metas compartidas</p>
        <p style={{ fontSize:20, fontWeight:700, color:T.text, marginTop:2 }}>Cofres 🏦</p>
      </div>
      {goals.map(g => {
        const pct = Math.round(g.current/g.target*100);
        return (
          <div key={g.id} style={{ margin:'8px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'18px', position:'relative', overflow:'hidden' }}>
            {celebrating === g.id && <Confetti active={true}/>}
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:g.color+'22', border:`1px solid ${g.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                {g.emoji}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:15, fontWeight:600, color:T.text }}>{g.name}</p>
                <p style={{ fontSize:12, color:T.sub, marginTop:2 }}>{fmt(g.current)} de {fmt(g.target)}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:22, fontWeight:700, color:g.color }}>{pct}%</p>
              </div>
            </div>
            <div style={{ height:8, background:'#ffffff08', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:g.color, borderRadius:99, transition:'width .7s cubic-bezier(.4,0,.2,1)' }}/>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {[5000,10000,25000].map(am => (
                <button key={am} onClick={() => add(g.id, am)} style={{
                  flex:1, background:'#ffffff06', border:`1px solid ${T.border}`, borderRadius:10,
                  color:T.sub, fontSize:12, fontWeight:500, cursor:'pointer', padding:'8px 0',
                  transition:'background .15s, color .15s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=g.color+'22'; e.currentTarget.style.color=g.color;}}
                onMouseLeave={e=>{e.currentTarget.style.background='#ffffff06'; e.currentTarget.style.color=T.sub;}}
                >+{fmt(am).replace('$','').trim()}</button>
              ))}
            </div>
            {pct >= 100 && <div style={{ marginTop:12, textAlign:'center', padding:'10px', background:T.accentDim, borderRadius:12 }}>
              <p style={{ fontSize:13, color:T.accent, fontWeight:600 }}>🎉 ¡Meta alcanzada! Ya pueden hacer el retiro</p>
            </div>}
          </div>
        );
      })}
      <div style={{ margin:'12px 16px 0', border:`1.5px dashed ${T.border}`, borderRadius:20, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', color:T.muted }}>
        <Icon name="plus" size={22} color={T.muted}/>
        <p style={{ fontSize:13, fontWeight:500 }}>Nuevo cofre</p>
      </div>
    </div>
  );
};

export default Goals;

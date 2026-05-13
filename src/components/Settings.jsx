import React, { useState } from 'react';
import { T, USERS, CATEGORIES } from '../data/constants';
import Icon from './Icon';
import Avatar from './Avatar';

const Settings = () => {
  const [model, setModel] = useState('70-30');
  const [jPct, setJPct] = useState(70);
  const models = [
    { id:'comunista', label:'Comunista', desc:'Todo a un pozo común, sin cuentas' },
    { id:'50-50', label:'50 / 50', desc:'Cada uno paga mitad exacta siempre' },
    { id:'70-30', label:'Proporcional', desc:'Juan 70% · Mile 30% (por ingresos)' },
  ];
  const cats = CATEGORIES.slice(0,8).map((c,i)=>({...c, shared: i<6}));
  const [catMap, setCatMap] = useState(() => Object.fromEntries(cats.map(c=>[c.cat, c.shared])));

  return (
    <div style={{ flex:1, overflowY:'auto', paddingBottom:90 }}>
      <div style={{ padding:'16px 20px 8px' }}>
        <p style={{ fontSize:11, color:T.muted, letterSpacing:.8, textTransform:'uppercase', fontWeight:600 }}>Configuración</p>
        <p style={{ fontSize:20, fontWeight:700, color:T.text, marginTop:2 }}>Contrato Financiero</p>
      </div>

      {/* Couple info */}
      <div style={{ margin:'8px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'16px' }}>
        <p style={{ fontSize:12, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:12 }}>Pareja vinculada</p>
        <div style={{ display:'flex', alignItems:'center', gap:0 }}>
          <Avatar user="juan" size={44}/>
          <div style={{ flex:1, marginLeft:12 }}>
            <p style={{ fontSize:15, fontWeight:600, color:T.text }}>Juan & Mile</p>
            <p style={{ fontSize:12, color:T.sub }}>Vinculados desde Mar 2026</p>
          </div>
          <div style={{ width:8, height:8, borderRadius:'50%', background:T.accent, boxShadow:`0 0 8px ${T.accent}` }}/>
        </div>
      </div>

      {/* Model selector */}
      <div style={{ margin:'12px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'16px' }}>
        <p style={{ fontSize:12, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:12 }}>Modelo de división</p>
        {models.map(m => (
          <div key={m.id} onClick={() => setModel(m.id)} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px', borderRadius:13, marginBottom:6,
            background: model===m.id ? T.accentDim : '#ffffff04',
            border:`1px solid ${model===m.id ? T.accent+'66' : T.border}`,
            cursor:'pointer', transition:'background .15s',
          }}>
            <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${model===m.id ? T.accent : T.muted}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {model===m.id && <div style={{ width:9, height:9, borderRadius:'50%', background:T.accent }}/>}
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color: model===m.id ? T.accent : T.text }}>{m.label}</p>
              <p style={{ fontSize:11, color:T.sub, marginTop:1 }}>{m.desc}</p>
            </div>
          </div>
        ))}
        {model === '70-30' && (
          <div style={{ marginTop:8, padding:'12px', background:'#ffffff04', borderRadius:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:12, color:T.sub }}>Juan: {jPct}%</span>
              <span style={{ fontSize:12, color:T.sub }}>Mile: {100-jPct}%</span>
            </div>
            <input type="range" min={10} max={90} value={jPct} onChange={e=>setJPct(+e.target.value)}
              style={{ width:'100%', accentColor:T.accent }}/>
          </div>
        )}
      </div>

      {/* Category rules */}
      <div style={{ margin:'12px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'16px' }}>
        <p style={{ fontSize:12, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:12 }}>¿Qué categorías son compartidas?</p>
        {Object.entries(catMap).map(([cat, shared]) => {
          const emoji = CATEGORIES.find(c=>c.cat===cat)?.emoji;
          return (
            <div key={cat} onClick={() => setCatMap(m => ({...m, [cat]: !m[cat]}))} style={{
              display:'flex', alignItems:'center', padding:'10px 0',
              borderBottom:`1px solid ${T.border}`, cursor:'pointer',
            }}>
              <span style={{ fontSize:18, marginRight:10 }}>{emoji}</span>
              <span style={{ flex:1, fontSize:14, color:T.textDim }}>{cat}</span>
              <div style={{
                width:44, height:24, borderRadius:99,
                background: shared ? T.accent : T.border,
                transition:'background .2s', position:'relative',
              }}>
                <div style={{
                  position:'absolute', top:3, left: shared ? 23 : 3,
                  width:18, height:18, borderRadius:'50%', background:'#fff',
                  transition:'left .2s',
                }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;

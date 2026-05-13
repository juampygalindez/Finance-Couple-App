import React, { useState, useEffect } from 'react';
import { T } from '../data/constants';
import Icon from './Icon';

const Settings = ({ users, categories, settings, onSettingChange, onBudgetChange }) => {
  // Parse settings from props with fallbacks
  const [model, setModel] = useState(settings?.divisionModel || '70-30');
  const [jPct, setJPct] = useState(parseInt(settings?.jPct, 10) || 70);
  const [catMap, setCatMap] = useState(() => {
    if (settings?.catMap) {
      try {
        return JSON.parse(settings.catMap);
      } catch {
        // Fall through to default
      }
    }
    // Default mapping based on category shared_default
    return Object.fromEntries(
      (categories || []).slice(0, 8).map(c => [c.name, c.shared_default !== false])
    );
  });

  // Sync local state when settings prop changes
  useEffect(() => {
    if (settings?.divisionModel) setModel(settings.divisionModel);
    if (settings?.jPct) setJPct(parseInt(settings.jPct, 10) || 70);
    if (settings?.catMap) {
      try {
        setCatMap(JSON.parse(settings.catMap));
      } catch {
        // Keep existing state on parse error
      }
    }
  }, [settings]);

  const models = [
    { id:'comunista', label:'Comunista', desc:'Todo a un pozo común, sin cuentas' },
    { id:'50-50', label:'50 / 50', desc:'Cada uno paga mitad exacta siempre' },
    { id:'70-30', label:'Proporcional', desc:'Juan 70% · Mile 30% (por ingresos)' },
  ];

  // Handlers that persist to DB
  const handleModelChange = (newModel) => {
    setModel(newModel);
    onSettingChange?.('divisionModel', newModel);
  };

  const handleJPctChange = (newPct) => {
    setJPct(newPct);
    onSettingChange?.('jPct', String(newPct));
  };

  const handleCatMapChange = (cat, newValue) => {
    const newCatMap = { ...catMap, [cat]: newValue };
    setCatMap(newCatMap);
    onSettingChange?.('catMap', JSON.stringify(newCatMap));
  };

  // Get primary users for display
  const juanUser = users?.find(u => u.key === 'juan');
  const mileUser = users?.find(u => u.key === 'mile');

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
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: (juanUser?.color || '#818cf8') + '22',
            border: `1.5px solid ${(juanUser?.color || '#818cf8')}44`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 17, color: juanUser?.color || '#818cf8', fontWeight: 600, flexShrink: 0,
          }}>{juanUser?.initial || 'J'}</div>
          <div style={{ flex:1, marginLeft:12 }}>
            <p style={{ fontSize:15, fontWeight:600, color:T.text }}>{juanUser?.name || 'Juan'} & {mileUser?.name || 'Mile'}</p>
            <p style={{ fontSize:12, color:T.sub }}>Vinculados desde Mar 2026</p>
          </div>
          <div style={{ width:8, height:8, borderRadius:'50%', background:T.accent, boxShadow:`0 0 8px ${T.accent}` }}/>
        </div>
      </div>

      {/* Model selector */}
      <div style={{ margin:'12px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'16px' }}>
        <p style={{ fontSize:12, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:12 }}>Modelo de división</p>
        {models.map(m => (
          <div key={m.id} onClick={() => handleModelChange(m.id)} style={{
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
              <span style={{ fontSize:12, color:T.sub }}>{juanUser?.name || 'Juan'}: {jPct}%</span>
              <span style={{ fontSize:12, color:T.sub }}>{mileUser?.name || 'Mile'}: {100-jPct}%</span>
            </div>
            <input type="range" min={10} max={90} value={jPct} onChange={e=>handleJPctChange(+e.target.value)}
              style={{ width:'100%', accentColor:T.accent }}/>
          </div>
        )}
      </div>

      {/* Category rules */}
      <div style={{ margin:'12px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:20, padding:'16px' }}>
        <p style={{ fontSize:12, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:12 }}>¿Qué categorías son compartidas?</p>
        {Object.entries(catMap).map(([catName, shared]) => {
          const catObj = categories?.find(c => c.name === catName);
          const emoji = catObj?.emoji;
          return (
            <div key={catName} onClick={() => handleCatMapChange(catName, !shared)} style={{
              display:'flex', alignItems:'center', padding:'10px 0',
              borderBottom:`1px solid ${T.border}`, cursor:'pointer',
            }}>
              <span style={{ fontSize:18, marginRight:10 }}>{emoji}</span>
              <span style={{ flex:1, fontSize:14, color:T.textDim }}>{catName}</span>
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

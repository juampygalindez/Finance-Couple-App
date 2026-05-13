import React from 'react';
import { T } from '../data/constants';
import Icon from './Icon';

const NavBtn = ({ it, tab, setTab }) => {
  const active = tab === it.id;
  return (
    <button onClick={() => setTab(it.id)} style={{
      flex:1, background:'none', border:'none', cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap:3,
      color: active ? T.accent : T.muted, transition:'color .15s',
      padding:'4px 0',
    }}>
      <Icon name={it.icon} size={22} color={active ? T.accent : T.muted} strokeWidth={active ? 2 : 1.7}/>
      <span style={{ fontSize:10, fontWeight: active ? 600 : 400, letterSpacing:.2 }}>{it.label}</span>
    </button>
  );
};

const BottomNav = ({ tab, setTab, onPlus }) => {
  const items = [
    { id:'home', icon:'home', label:'Inicio' },
    { id:'goals', icon:'target', label:'Metas' },
    { id:'stats', icon:'bar', label:'Stats' },
    { id:'settings', icon:'settings', label:'Reglas' },
  ];
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      background: T.surface, borderTop:`1px solid ${T.border}`,
      display:'flex', alignItems:'center',
      paddingBottom: 20, paddingTop: 10, paddingLeft: 8, paddingRight: 8,
      zIndex: 100,
    }}>
      {items.slice(0,2).map(it => <NavBtn key={it.id} it={it} tab={tab} setTab={setTab}/>)}
      <button onClick={onPlus} style={{
        flex:'0 0 52px', height:52, borderRadius:'50%',
        background: T.accent, border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 0 24px ${T.accent}55`,
        transition:'transform .15s, box-shadow .15s',
        margin:'0 8px',
      }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(.93)'}
      onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      >
        <Icon name="plus" size={24} color="#000" strokeWidth={2.5}/>
      </button>
      {items.slice(2).map(it => <NavBtn key={it.id} it={it} tab={tab} setTab={setTab}/>)}
    </div>
  );
};

export default BottomNav;

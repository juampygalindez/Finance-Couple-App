import React, { useState } from 'react';
import { T } from '../data/constants';
import { fmt } from '../utils/format';
import Icon from './Icon';

const AddModal = ({ onClose, onAdd, users, categories }) => {
  const [step, setStep] = useState('pick'); // pick | manual | voice | photo
  const [form, setForm] = useState({ 
    desc:'', 
    amount:'', 
    cat: categories[0]?.name || 'Supermercado', 
    user: users[0]?.key || 'juan', 
    shared:true 
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const submit = () => {
    if (!form.desc || !form.amount) return;
    onAdd({
      id: Date.now(), user: form.user, shared: form.shared,
      cat: form.cat, desc: form.desc, amount: +form.amount.replace(/\./g,''),
      emoji: categories.find(c=>c.name===form.cat)?.emoji || '📦',
      ts: new Date(),
    });
    onClose();
  };

  const simulateAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      setForm({ desc:'Coto — compras semanales', amount:'14500', cat:'Supermercado', user:'juan', shared:true });
      setVoiceText('"Compré en el supermercado por 14 mil 500 pesos, lo pagué yo"');
      setAiLoading(false);
      setStep('manual');
    }, 1800);
  };

  return (
    <div style={{ position:'absolute', inset:0, zIndex:300, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'#00000088' }}/>
      <div style={{ position:'relative', background:T.surface, borderRadius:'24px 24px 0 0', border:`1px solid ${T.border}`, borderBottom:'none', padding:'8px 20px 32px', maxHeight:'85%', overflowY:'auto' }}>
        {/* drag handle */}
        <div style={{ width:36, height:4, background:T.border, borderRadius:99, margin:'8px auto 20px' }}/>

        {step === 'pick' && <>
          <p style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:4 }}>Nuevo gasto</p>
          <p style={{ fontSize:13, color:T.sub, marginBottom:24 }}>¿Cómo querés cargarlo?</p>
          {[
            { id:'voice', icon:'mic', label:'Por audio', desc:'Grabá y la IA lo completa', color:'#818cf8' },
            { id:'photo', icon:'camera', label:'Foto del ticket', desc:'Sacá foto y el OCR lo lee', color:'#f472b6' },
            { id:'manual', icon:'pencil', label:'Manual', desc:'Escribilo vos', color:T.accent },
          ].map(opt => (
            <div key={opt.id} onClick={()=>{ if(opt.id==='voice'||opt.id==='photo') simulateAI(); else setStep('manual'); }} style={{
              display:'flex', alignItems:'center', gap:14, padding:'16px', borderRadius:16,
              background:T.card, border:`1px solid ${T.border}`, marginBottom:10, cursor:'pointer',
              transition:'background .15s',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='#ffffff06'}
            onMouseLeave={e=>e.currentTarget.style.background=T.card}
            >
              <div style={{ width:48, height:48, borderRadius:14, background:opt.color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name={opt.icon} size={22} color={opt.color}/>
              </div>
              <div>
                <p style={{ fontSize:15, fontWeight:600, color:T.text }}>{opt.label}</p>
                <p style={{ fontSize:12, color:T.sub, marginTop:2 }}>{opt.desc}</p>
              </div>
              <Icon name="arrow" size={16} color={T.muted} style={{ marginLeft:'auto' }}/>
            </div>
          ))}
        </>}

        {aiLoading && <div style={{ textAlign:'center', padding:'40px 0' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', border:`2px solid ${T.accentDim}`, borderTop:`2px solid ${T.accent}`, margin:'0 auto 16px', animation:'spin 1s linear infinite' }}/>
          <p style={{ color:T.sub, fontSize:14 }}>La IA está procesando…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>}

        {step === 'manual' && !aiLoading && <>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <button onClick={()=>setStep('pick')} style={{ background:'none', border:'none', color:T.sub, cursor:'pointer', padding:0 }}>
              <Icon name="x" size={20} color={T.sub}/>
            </button>
            <p style={{ fontSize:18, fontWeight:700, color:T.text }}>Agregar gasto</p>
          </div>

          {voiceText && <div style={{ background:T.accentDim, border:`1px solid ${T.accent}44`, borderRadius:12, padding:'10px 12px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:8 }}>
            <Icon name="sparkle" size={14} color={T.accent}/>
            <p style={{ fontSize:12, color:T.accentLt, fontStyle:'italic' }}>{voiceText}</p>
          </div>}

          {/* Amount */}
          <p style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:6 }}>Monto</p>
          <input value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0" type="number"
            style={{ width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'13px 16px', color:T.text, fontSize:24, fontWeight:700, fontFamily:'DM Sans', outline:'none', marginBottom:14 }}/>

          {/* Description */}
          <p style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:6 }}>Descripción</p>
          <input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Ej. Supermercado Coto"
            style={{ width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'13px 16px', color:T.text, fontSize:15, fontFamily:'DM Sans', outline:'none', marginBottom:14 }}/>

          {/* Category */}
          <p style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:8 }}>Categoría</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
            {categories.slice(0,8).map(c => (
              <button key={c.name} onClick={()=>setForm(f=>({...f,cat:c.name}))} style={{
                background: form.cat===c.name ? T.accentDim : T.card,
                border:`1px solid ${form.cat===c.name ? T.accent+'88' : T.border}`,
                borderRadius:10, padding:'6px 10px', cursor:'pointer',
                color: form.cat===c.name ? T.accent : T.sub, fontSize:12, fontWeight:500,
              }}>{c.emoji} {c.name}</button>
            ))}
          </div>

          {/* Who paid + shared */}
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:8 }}>¿Quién pagó?</p>
              <div style={{ display:'flex', gap:6 }}>
                {users.map(u=>(
                  <button key={u.key} onClick={()=>setForm(f=>({...f,user:u.key}))} style={{
                    flex:1, padding:'8px', borderRadius:11,
                    background: form.user===u.key ? u.color+'22' : T.card,
                    border:`1px solid ${form.user===u.key ? u.color+'66' : T.border}`,
                    color: form.user===u.key ? u.color : T.sub,
                    cursor:'pointer', fontSize:13, fontWeight:600,
                  }}>{u.name}</button>
                ))}
              </div>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:11, color:T.muted, fontWeight:600, letterSpacing:.6, textTransform:'uppercase', marginBottom:8 }}>¿Es compartido?</p>
              <div style={{ display:'flex', gap:6 }}>
                {[true, false].map(v=>(
                  <button key={String(v)} onClick={()=>setForm(f=>({...f,shared:v}))} style={{
                    flex:1, padding:'8px', borderRadius:11,
                    background: form.shared===v ? T.accentDim : T.card,
                    border:`1px solid ${form.shared===v ? T.accent+'66' : T.border}`,
                    color: form.shared===v ? T.accent : T.sub,
                    cursor:'pointer', fontSize:12, fontWeight:600,
                  }}>{v ? 'Sí' : 'No'}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={submit} style={{
            width:'100%', background:T.accent, border:'none', borderRadius:14,
            padding:'15px', color:'#000', fontSize:15, fontWeight:700, cursor:'pointer',
            boxShadow:`0 0 24px ${T.accent}44`, transition:'opacity .15s',
          }}>Guardar gasto</button>
        </>}
      </div>
    </div>
  );
};

export default AddModal;

import React, { useState } from 'react';
import { T } from '../data/constants';
import { fmt, timeAgo } from '../utils/format';
import Icon from './Icon';

const DetailModal = ({ tx, onClose, users, onUpdateTransaction, onDeleteTransaction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    desc: tx?.desc || '',
    amount: tx?.amount?.toString() || '',
    cat: tx?.cat || '',
    shared: tx?.shared ?? true,
  });

  if (!tx) return null;

  const u = users.find(u => u.key === tx.user);
  const userColor = u?.color || T.sub;
  const userName = u?.name || tx.user;

  const handleSave = () => {
    onUpdateTransaction(tx.id, {
      ...tx,
      desc: editForm.desc,
      amount: +editForm.amount,
      cat: editForm.cat,
      shared: editForm.shared,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTransaction(tx.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
      <div style={{ position:'absolute', inset:0, zIndex:300, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position:'absolute', inset:0, background:'#00000088' }}/>
        <div style={{ position:'relative', background:T.surface, borderRadius:'24px 24px 0 0', border:`1px solid ${T.border}`, borderBottom:'none', padding:'8px 20px 40px' }}>
          <div style={{ width:36, height:4, background:T.border, borderRadius:99, margin:'8px auto 24px' }}/>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ width:64, height:64, borderRadius:18, background:T.redDim, border:`1px solid ${T.red}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 12px' }}>
              <Icon name="trash" size={28} color={T.red}/>
            </div>
            <p style={{ fontSize:18, fontWeight:700, color:T.text }}>¿Eliminar este gasto?</p>
            <p style={{ fontSize:14, color:T.sub, marginTop:8 }}>{tx.desc} — {fmt(tx.amount)}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setShowDeleteConfirm(false)} style={{
              flex:1, padding:'14px', borderRadius:14, background:T.card, border:`1px solid ${T.border}`,
              color:T.sub, fontSize:14, fontWeight:600, cursor:'pointer',
            }}>Cancelar</button>
            <button onClick={handleDelete} style={{
              flex:1, padding:'14px', borderRadius:14, background:T.redDim, border:`1px solid ${T.red}44`,
              color:T.red, fontSize:14, fontWeight:600, cursor:'pointer',
            }}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:'absolute', inset:0, zIndex:300, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'#00000088' }}/>
      <div style={{ position:'relative', background:T.surface, borderRadius:'24px 24px 0 0', border:`1px solid ${T.border}`, borderBottom:'none', padding:'8px 20px 40px' }}>
        <div style={{ width:36, height:4, background:T.border, borderRadius:99, margin:'8px auto 24px' }}/>
        
        {/* Header with actions */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <button onClick={onClose} style={{ background:'none', border:'none', color:T.sub, cursor:'pointer', padding:4 }}>
            <Icon name="arrow" size={20} color={T.sub} style={{ transform:'rotate(90deg)' }}/>
          </button>
          <div style={{ display:'flex', gap:8 }}>
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} style={{ 
                  background:'none', border:'none', color:T.accent, cursor:'pointer', padding:4,
                  display:'flex', alignItems:'center', gap:4
                }}>
                  <Icon name="pencil" size={18} color={T.accent}/>
                  <span style={{ fontSize:13, fontWeight:600 }}>Editar</span>
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} style={{ 
                  background:'none', border:'none', color:T.red, cursor:'pointer', padding:4,
                  display:'flex', alignItems:'center', gap:4
                }}>
                  <Icon name="trash" size={18} color={T.red}/>
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 12px' }}>{tx.emoji}</div>
          
          {isEditing ? (
            <>
              <input 
                value={editForm.amount} 
                onChange={e => setEditForm(f => ({...f, amount: e.target.value}))}
                type="number"
                style={{ 
                  width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, 
                  padding:'10px 16px', color:T.text, fontSize:24, fontWeight:700, 
                  fontFamily:'DM Sans', outline:'none', marginBottom:10, textAlign:'center'
                }}
              />
              <input 
                value={editForm.desc} 
                onChange={e => setEditForm(f => ({...f, desc: e.target.value}))}
                style={{ 
                  width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, 
                  padding:'10px 16px', color:T.text, fontSize:15, 
                  fontFamily:'DM Sans', outline:'none', textAlign:'center'
                }}
              />
            </>
          ) : (
            <>
              <p style={{ fontSize:28, fontWeight:700, color:T.text }}>{fmt(tx.amount)}</p>
              <p style={{ fontSize:15, color:T.sub, marginTop:4 }}>{tx.desc}</p>
            </>
          )}
        </div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, overflow:'hidden' }}>
          {isEditing ? (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:14, color:T.sub }}>Categoría</span>
                <input 
                  value={editForm.cat} 
                  onChange={e => setEditForm(f => ({...f, cat: e.target.value}))}
                  style={{ 
                    background:'none', border:'none', color:T.text, fontSize:14, fontWeight:500,
                    textAlign:'right', outline:'none', fontFamily:'DM Sans'
                  }}
                />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:14, color:T.sub }}>Tipo</span>
                <div style={{ display:'flex', gap:8 }}>
                  {[
                    { value: true, label: 'Compartido' },
                    { value: false, label: 'Personal' },
                  ].map(opt => (
                    <button 
                      key={String(opt.value)}
                      onClick={() => setEditForm(f => ({...f, shared: opt.value}))}
                      style={{
                        padding:'4px 10px', borderRadius:8,
                        background: editForm.shared === opt.value ? T.accentDim : 'transparent',
                        border:`1px solid ${editForm.shared === opt.value ? T.accent+'66' : T.border}`,
                        color: editForm.shared === opt.value ? T.accent : T.sub,
                        fontSize:12, cursor:'pointer',
                      }}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px' }}>
                <span style={{ fontSize:14, color:T.sub }}>Cuándo</span>
                <span style={{ fontSize:14, fontWeight:500, color:T.text }}>{timeAgo(tx.ts)}</span>
              </div>
            </>
          ) : (
            <>
              {[
                ['Categoría', tx.cat],
                ['Pagó', userName],
                ['Tipo', tx.shared ? 'Gasto compartido' : 'Gasto personal'],
                ['Cuándo', timeAgo(tx.ts)],
              ].map(([k,v],i,arr) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom: i<arr.length-1 ? `1px solid ${T.border}` : 'none' }}>
                  <span style={{ fontSize:14, color:T.sub }}>{k}</span>
                  <span style={{ fontSize:14, fontWeight:500, color:T.text }}>{v}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {isEditing && (
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={() => setIsEditing(false)} style={{
              flex:1, padding:'14px', borderRadius:14, background:T.card, border:`1px solid ${T.border}`,
              color:T.sub, fontSize:14, fontWeight:600, cursor:'pointer',
            }}>Cancelar</button>
            <button onClick={handleSave} style={{
              flex:1, padding:'14px', borderRadius:14, background:T.accent, border:'none',
              color:'#000', fontSize:14, fontWeight:700, cursor:'pointer',
              boxShadow:`0 0 24px ${T.accent}44`,
            }}>Guardar cambios</button>
          </div>
        )}

        {tx.shared && !isEditing && (
          <button style={{ width:'100%', marginTop:12, background:T.accentDim, border:`1px solid ${T.accent}44`, borderRadius:14, padding:'14px', color:T.accent, fontSize:14, fontWeight:600, cursor:'pointer' }}>
            Marcar como saldado
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailModal;

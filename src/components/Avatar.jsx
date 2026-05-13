import React from 'react';

const Avatar = ({ user, size=32 }) => {
  // user is expected to be an object with: name, initial, color
  // or it can be null/undefined while loading
  if (!user) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: '#999922', border: '1.5px solid #999944',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize: size * 0.4, color: '#999', fontWeight: 600, flexShrink: 0,
      }}>?</div>
    );
  }

  const color = user.color || '#999';
  const initial = user.initial || user.name?.charAt(0) || '?';

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '22', border: `1.5px solid ${color}44`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: size * 0.4, color: color, fontWeight: 600, flexShrink: 0,
    }}>{initial}</div>
  );
};

export default Avatar;

import React from 'react';
import { USERS } from '../data/constants';

const Avatar = ({ user, size=32 }) => {
  const u = USERS[user];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: u.color + '22', border: `1.5px solid ${u.color}44`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: size * 0.4, color: u.color, fontWeight: 600, flexShrink: 0,
    }}>{u.avatar}</div>
  );
};

export default Avatar;

import React from 'react';

const Confetti = ({ active }) => {
  if (!active) return null;
  const pieces = Array.from({length:30}, (_,i) => ({
    id:i, x:Math.random()*100, delay:Math.random()*500,
    color:['#10b981','#818cf8','#f472b6','#fbbf24','#60a5fa'][i%5],
    size: 6+Math.random()*6,
  }));
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:200, overflow:'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:'-10px',
          width:p.size, height:p.size, borderRadius:p.size/2,
          background:p.color,
          animation:`fall 1.2s ${p.delay}ms ease-in forwards`,
        }}/>
      ))}
      <style>{`@keyframes fall { to { transform: translateY(700px) rotate(360deg); opacity:0; } }`}</style>
    </div>
  );
};

export default Confetti;

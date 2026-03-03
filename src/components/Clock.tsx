import React, { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
      <p className="text-emerald-300 font-mono text-sm md:text-base tracking-wider" dir="rtl">
        {time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
        <span className="mx-2 text-white/40">|</span>
        {time.toLocaleTimeString('ar-EG')}
      </p>
    </div>
  );
}

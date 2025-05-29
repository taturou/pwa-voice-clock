import React, { useEffect, useState } from 'react';

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => {
      const curr = new Date();
      setNow(curr);
      // 5分刻みかつ秒が 0 のときに読み上げ
      if (curr.getSeconds() === 0 && curr.getMinutes() % 5 === 0) {
        const msg = `現在の時刻は${curr.getHours()}時${curr.getMinutes()}分です`;
        const u = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(u);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = v => String(v).padStart(2, '0');
  return (
    <div style={{
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      height:'100vh', fontFamily:'sans-serif'
    }}>
      <h1>現在時刻</h1>
      <p style={{ fontSize:'3rem', margin:0 }}>
        {pad(now.getHours())}:
        {pad(now.getMinutes())}:
        {pad(now.getSeconds())}
      </p>
    </div>
  );
}

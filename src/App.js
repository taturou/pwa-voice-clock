import React, { useEffect, useState } from 'react';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [intervalMin, setIntervalMin] = useState(5);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const tick = () => {
      const curr = new Date();
      setNow(curr);
      if (curr.getSeconds() === 0 && curr.getMinutes() % intervalMin === 0) {
        // 読み上げ
        const msg = `${curr.getHours()}時${curr.getMinutes()}分です`;
        const utterance = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(utterance);
        // 点滅エフェクト
        setBlinking(true);
        setTimeout(() => setBlinking(false), 500);
      }
    };
    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [intervalMin]);

  const pad = (v) => String(v).padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        fontFamily: 'sans-serif',
        backgroundColor: blinking ? 'red' : 'white',
        transition: 'background-color 0.5s ease',
      }}
    >
      <h1>現在時刻</h1>
      <p style={{ fontSize: '3rem', margin: 0 }}>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </p>
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="interval" style={{ marginRight: '0.5rem' }}>
          読み上げ間隔（分）:
        </label>
        <select
          id="interval"
          value={intervalMin}
          onChange={(e) => setIntervalMin(Number(e.target.value))}
        >
          {Array.from({ length: 60 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

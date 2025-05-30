import React, { useEffect, useState } from 'react';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [intervalMin, setIntervalMin] = useState(5);
  const [blinking, setBlinking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [targetTime, setTargetTime] = useState(''); // HH:MM

  const enableAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      const unlock = new SpeechSynthesisUtterance('');
      speechSynthesis.speak(unlock);
    }
  };

  useEffect(() => {
    const tick = () => {
      const curr = new Date();
      setNow(curr);

      if (
        curr.getSeconds() === 0 &&
        curr.getMinutes() % intervalMin === 0 &&
        audioEnabled
      ) {
        const hours = curr.getHours();
        const mins = curr.getMinutes();

        let msg = `${hours}時${mins}分です`;
        if (targetTime) {
          const [tH, tM] = targetTime.split(':').map(Number);
          const tgt = new Date(curr);
          tgt.setHours(tH, tM, 0, 0);
          const diffM = Math.ceil((tgt - curr) / 60000);
          if (diffM > 0) {
            msg += `。目標まであと${diffM}分です`;
          } else {
            msg += `。指定時刻を過ぎました`;
          }
        }
        speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [intervalMin, audioEnabled, targetTime]);

  const pad = (v) => String(v).padStart(2, '0');
  const lastModified = document.lastModified;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        height: '-webkit-fill-available',
        width: '100vw',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        backgroundColor: blinking ? '#ffeb3b' : 'white',
        transition: 'background-color 0.2s ease-out',
        textAlign: 'center',
      }}
    >
      <h1>現在時刻</h1>
      <p style={{ fontSize: '3rem', margin: 0 }}>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </p>
      <div style={{ marginTop: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>読み上げ間隔（分）:</label>
        <select value={intervalMin} onChange={(e) => setIntervalMin(Number(e.target.value))}>
          {Array.from({ length: 60 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>目標時刻:</label>
        <input
          type="time"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
        />
      </div>
      {!audioEnabled && (
        <button
          onClick={enableAudio}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          音声を有効にする
        </button>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(env(safe-area-inset-bottom) + 10px)',
          fontSize: '0.8rem',
          color: '#666',
        }}
      >
        更新日時: {lastModified}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [intervalMin, setIntervalMin] = useState(() => {
    const saved = localStorage.getItem('intervalMin');
    return saved ? Number(saved) : 5;
  });
  const [blinking, setBlinking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [targetTime, setTargetTime] = useState(() => {
    const saved = localStorage.getItem('targetTime');
    return saved || '';
  });

  // Speak unlock and enable audio
  const enableAudio = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      const unlock = new SpeechSynthesisUtterance('');
      speechSynthesis.speak(unlock);
    }
  };

  // Speak current time on demand
  const speakCurrentTime = () => {
    if (!audioEnabled) return;
    const curr = new Date();
    const hours = curr.getHours();
    const mins = curr.getMinutes();
    const msg = mins === 0
      ? `${hours}時ちょうどです`
      : `${hours}時${mins}分です`;
    speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  };

  // Clear target time
  const clearTargetTime = () => {
    setTargetTime('');
  };

  // Persist intervalMin
  useEffect(() => {
    localStorage.setItem('intervalMin', intervalMin.toString());
  }, [intervalMin]);

  // Persist targetTime
  useEffect(() => {
    localStorage.setItem('targetTime', targetTime);
  }, [targetTime]);

  // Main ticking logic
  useEffect(() => {
    if (!audioEnabled) return;
    const tick = () => {
      const curr = new Date();
      setNow(curr);
      if (
        curr.getSeconds() === 0 &&
        curr.getMinutes() % intervalMin === 0
      ) {
        speakCurrentTime();
        if (targetTime) {
          const [tH, tM] = targetTime.split(':').map(Number);
          const tgt = new Date(curr);
          tgt.setHours(tH, tM, 0, 0);
          const diffM = Math.ceil((tgt - curr) / 60000);
          let remMsg = '';
          if (diffM > 0) {
            remMsg = `あと${diffM}分です`;
          } else if (diffM === 0) {
            remMsg = `指定時刻になりました`;
          } else {
            const late = Math.abs(diffM);
            remMsg = `${late}分遅れです`;
          }
          setTimeout(() => {
            speechSynthesis.speak(new SpeechSynthesisUtterance(remMsg));
          }, 500);
        }
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

  // Before enabling audio
  if (!audioEnabled) {
    return (
      <div style={{
        position:'fixed', top:0,left:0,right:0,bottom:0,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        backgroundColor:'#fff',textAlign:'center',fontFamily:'sans-serif',padding:'1rem'
      }}>
        <h2>音声を有効にしてください</h2>
        <button onClick={enableAudio} style={{
          marginTop:'1rem',padding:'0.75rem 1.5rem',fontSize:'1.2rem',cursor:'pointer'
        }}>音声を有効にする</button>
      </div>
    );
  }

  // Main UI
  return (
    <div style={{
      position:'fixed', top:0,left:0,right:0,bottom:0,
      height:'100vh',height:'-webkit-fill-available',width:'100vw',
      paddingBottom:'calc(env(safe-area-inset-bottom)+30px)',boxSizing:'border-box',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      fontFamily:'sans-serif',backgroundColor:blinking?'#ffeb3b':'white',transition:'background-color 0.2s ease-out',textAlign:'center'
    }}>
      <h1>現在時刻</h1>
      <p style={{fontSize:'3rem',margin:0}}>{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}</p>
      <button onClick={speakCurrentTime} style={{marginTop:'1rem',padding:'0.5rem 1rem',fontSize:'1rem',cursor:'pointer'}}>
        現在時刻を音声で伝える
      </button>
      <div style={{marginTop:'1rem'}}>
        <label style={{marginRight:'0.5rem'}}>読み上げ間隔（分）:</label>
        <select value={intervalMin} onChange={(e)=>setIntervalMin(Number(e.target.value))}>
          {Array.from({length:60},(_,i)=>i+1).map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{marginTop:'1rem',display:'flex',alignItems:'center'}}>
        <label style={{marginRight:'0.5rem'}}>目標時刻:</label>
        <input type="time" value={targetTime} onChange={e=>setTargetTime(e.target.value)}/>
        {targetTime && (
          <button onClick={clearTargetTime} style={{
            marginLeft:'0.5rem',padding:'0.5rem 1rem',fontSize:'0.9rem',cursor:'pointer'
          }}>
            クリア
          </button>
        )}
      </div>
      {/* 更新日時: 目標時刻の下に表示 */}
      <div style={{
        marginTop:'1rem', fontSize:'0.8rem', color:'#666'
      }}>
        更新日時: {lastModified}
      </div>
    </div>
  );
}

(function() {
  "use strict";
  let audioCtx = null, ambientSource = null, isMuted = true, heartbeatInterval = null;
  function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
  function playPageTurn() {
    if (isMuted) return; initAudio();
    const dur = 0.4, bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15 * Math.pow(1 - i / bufferSize, 4);
    const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 600;
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.4, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); noise.start();
    const osc = audioCtx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = 180;
    const oGain = audioCtx.createGain(); oGain.gain.setValueAtTime(0.1, audioCtx.currentTime); oGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(oGain); oGain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  }
  function startAmbient() {
    if (!audioCtx) initAudio(); if (ambientSource) return;
    const osc1 = audioCtx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 55;
    const gain1 = audioCtx.createGain(); gain1.gain.value = 0.015; osc1.connect(gain1); gain1.connect(audioCtx.destination);
    const osc2 = audioCtx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 40;
    const gain2 = audioCtx.createGain(); gain2.gain.value = 0.02;
    const lfo = audioCtx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 1;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.02; lfo.connect(lfoGain); lfoGain.connect(gain2.gain);
    osc2.connect(gain2); gain2.connect(audioCtx.destination); osc1.start(); osc2.start(); lfo.start();
    ambientSource = { osc1, osc2, lfo };
    if (!heartbeatInterval) heartbeatInterval = setInterval(() => {
      if (!isMuted && audioCtx) {
        const tOsc = audioCtx.createOscillator(); tOsc.type = 'square'; tOsc.frequency.value = 1000;
        const tGain = audioCtx.createGain(); tGain.gain.setValueAtTime(0.05, audioCtx.currentTime); tGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        tOsc.connect(tGain); tGain.connect(audioCtx.destination); tOsc.start(); tOsc.stop(audioCtx.currentTime + 0.05);
      }
    }, 4000);
  }
  function stopAmbient() { if (ambientSource) { ambientSource.osc1.stop(); ambientSource.osc2.stop(); ambientSource.lfo.stop(); ambientSource = null; } if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; } }
  function toggleMute() { isMuted = !isMuted; if (isMuted) { if (audioCtx) audioCtx.suspend(); stopAmbient(); } else { if (audioCtx) audioCtx.resume(); startAmbient(); } return isMuted; }
  window.ITAUE_AUDIO = { playPageTurn, toggleMute, isMuted: () => isMuted };
})();

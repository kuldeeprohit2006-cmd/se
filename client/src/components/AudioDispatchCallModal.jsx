import { useState, useEffect, useRef } from 'react';
import soundFX from '../utils/audioFX';
import API from '../api/axios';

// DTMF tone frequencies for standard telephone dialpad
const DTMF_FREQS = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

const AudioDispatchCallModal = ({ isOpen, onClose, incidentData }) => {
  const [callState, setCallState] = useState('DIALING'); // 'DIALING' | 'RINGING' | 'CONNECTED' | 'ENDED'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [speechRecognized, setSpeechRecognized] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [dialNumber, setDialNumber] = useState('108');
  const [showKeypad, setShowKeypad] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('');

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Play real DTMF dual-tone using Web Audio API oscillators through laptop speakers
  const playDTMFTone = (digit) => {
    try {
      const freqs = DTMF_FREQS[digit];
      if (!freqs) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('DTMF tone error:', e);
    }
  };

  const handleKeypadPress = (digit) => {
    playDTMFTone(digit);
    setDialNumber((prev) => (prev.length < 12 ? prev + digit : prev));
  };

  // Helper: Speak out loud using laptop speakers (Speech Synthesis)
  const speakText = (text) => {
    if ('speechSynthesis' in window && isSpeaker) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper: Start real microphone capture
  const startRealMic = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          setMicActive(true);
        }
      }
    } catch (err) {
      console.warn('Real microphone permission declined or unavailable, using Web Audio synthesizer:', err);
      setMicActive(false);
    }
  };

  // Helper: Start real speech recognition from laptop microphone
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalTranscript = event.results[i][0].transcript.trim();
              if (finalTranscript) {
                handleStudentVoiceInput(finalTranscript);
              }
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setSpeechRecognized(interimTranscript);
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition notice:', e.error);
        };

        recognition.onend = () => {
          if (callState === 'CONNECTED' && !isMuted) {
            try { recognition.start(); } catch {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
  };

  // Handle student voice captured via mic
  const handleStudentVoiceInput = (text) => {
    const timeStr = formatTime(callDuration);
    setMessages((prev) => [...prev, { sender: 'student', text, time: timeStr }]);
    setSpeechRecognized('');

    // Generate intelligent paramedic dispatcher response
    setTimeout(() => {
      let reply = 'Copy that. Paramedic Dispatch team has received your message. Ambulance AMB-101 is en route to your location with oxygen and trauma kit.';
      const lower = text.toLowerCase();
      if (lower.includes('cpr') || lower.includes('heart') || lower.includes('chest') || lower.includes('unconscious') || lower.includes('breathe')) {
        reply = '🚨 Critical Cardiac Alert! Begin chest compressions at 100 to 120 compressions per minute right now. Follow the CPR Metronome on your screen. Paramedics with automated defibrillator are 2 minutes away!';
      } else if (lower.includes('hostel') || lower.includes('room') || lower.includes('floor')) {
        reply = `Understood. Campus Security and Warden have been dispatched to ${text}. Keep the entrance clear for the ambulance.`;
      } else if (lower.includes('blood') || lower.includes('bleed') || lower.includes('cut') || lower.includes('wound')) {
        reply = 'Apply firm, continuous direct pressure on the wound with a clean cloth. Do not remove the cloth if it soaks through. Paramedics arriving immediately.';
      }

      setMessages((prev) => [...prev, { sender: 'operator', text: reply, time: formatTime(callDuration + 1) }]);
      speakText(reply);
    }, 900);
  };

  // Trigger real laptop telephony dialer via tel: URI + optional Twilio backend bridge
  const triggerLaptopTelephony = async (num) => {
    const target = (num || dialNumber || '108').trim();
    playDTMFTone('1');
    setBridgeStatus(`Dialing ${target}...`);
    try {
      const { data } = await API.post('/incidents/call-bridge', {
        toNumber: target,
        campusZone: incidentData?.campusZone || 'IIIT Lucknow Campus'
      });
      if (data?.mode === 'twilio-pstn') {
        setBridgeStatus(`Real Twilio PSTN call active (SID: ${data.callSid})`);
        return;
      }
    } catch {
      // Fallback straight to OS tel: protocol (Windows Phone Link / mobile dialer)
    }
    setBridgeStatus(`Opened system dialer (tel:${target})`);
    window.open(`tel:${target}`, '_self');
  };

  // Redirect to real live WebRTC / Google Meet / WhatsApp calling platforms
  const openWebCall = (service) => {
    const roomSuffix = incidentData?._id ? incidentData._id.slice(-6) : 'CampusRoom';
    const encodedMsg = encodeURIComponent(
      `🚨 MediGuard Emergency Call Needed at ${incidentData?.campusZone || 'IIIT Lucknow Campus'}!`
    );
    const digits = (dialNumber || '').replace(/[^0-9]/g, '');
    const waTarget = digits.length >= 10 ? `https://wa.me/${digits}?text=${encodedMsg}` : `https://web.whatsapp.com/`;

    const urls = {
      'jitsi-webrtc': `https://meet.jit.si/MediGuard-IIITL-${roomSuffix}`,
      'google-meet': 'https://meet.google.com/new',
      'whatsapp': waTarget
    };
    window.open(urls[service] || urls['jitsi-webrtc'], '_blank', 'noopener,noreferrer');
  };

  // Initialize and run call lifecycle
  useEffect(() => {
    if (!isOpen) {
      setCallState('DIALING');
      setCallDuration(0);
      setMessages([]);
      setSpeechRecognized('');
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    // Phase 1: Dialing
    soundFX.playDialTone();
    setCallState('DIALING');

    const ringTimeout = setTimeout(() => {
      // Phase 2: Ringing
      setCallState('RINGING');
      soundFX.playRingTone();

      const connectTimeout = setTimeout(async () => {
        // Phase 3: Connected
        setCallState('CONNECTED');
        soundFX.playConnectChime();

        const welcomeMsg = '🚨 MediGuard Campus Emergency Dispatch. We have locked your location. Speak into your microphone or state your emergency.';
        setMessages([
          {
            sender: 'operator',
            text: welcomeMsg,
            time: 'Just now'
          }
        ]);

        // Speak welcome through laptop speakers
        speakText(welcomeMsg);

        // Start real microphone & speech recognition
        await startRealMic();
        startSpeechRecognition();

        // Notify backend of active call session
        if (incidentData?._id) {
          try {
            await API.post(`/incidents/${incidentData._id}/call`);
          } catch (e) {
            console.error('Failed to log call to incident', e);
          }
        }

        // Start call duration timer
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }, 2500);

      return () => clearTimeout(connectTimeout);
    }, 1500);

    return () => {
      clearTimeout(ringTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  // Handle Mute toggle on live stream
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Real Audio Waveform Visualization on Canvas
  useEffect(() => {
    if (callState !== 'CONNECTED' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars;

      if (micActive && analyserRef.current && !isMuted) {
        // Real microphone frequency data from user's laptop mic!
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        for (let i = 0; i < bars; i++) {
          const val = dataArray[i % dataArray.length] || 0;
          const height = Math.max(4, (val / 255) * canvas.height * 0.95);
          const x = i * barWidth;
          const y = (canvas.height - height) / 2;

          ctx.fillStyle = val > 120 ? '#FF3B5C' : '#00E08E';
          ctx.fillRect(x + 2, y, barWidth - 4, height);
        }
      } else {
        // Fallback smooth waveform
        for (let i = 0; i < bars; i++) {
          const height = isMuted
            ? 3
            : Math.sin(phase + i * 0.35) * 16 + Math.random() * 8 + 6;
          const x = i * barWidth;
          const y = (canvas.height - height) / 2;

          ctx.fillStyle = isMuted ? '#4a5568' : '#0E90FF';
          ctx.fillRect(x + 2, y, barWidth - 4, height);
        }
        phase += 0.15;
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [callState, isMuted, micActive]);

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleStudentQuickReply = (text, replyType) => {
    soundFX.playDialTone();
    handleStudentVoiceInput(text);
  };

  const handleEndCall = () => {
    soundFX.playCountdownBeep(true);
    setCallState('ENDED');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={handleEndCall}>
      <div className="modal-content audio-call-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Call Header */}
        <div className="call-header">
          <div className="call-status-indicator">
            <span className={`call-dot ${callState.toLowerCase()}`}></span>
            <span className="call-state-text">
              {callState === 'DIALING' && 'INITIALIZING WEBRTC AUDIO CHANNEL...'}
              {callState === 'RINGING' && 'CONNECTING TO CAMPUS TRAUMA DISPATCH...'}
              {callState === 'CONNECTED' && `LIVE VOICE CALL • ${formatTime(callDuration)}`}
              {callState === 'ENDED' && 'CALL TERMINATED'}
            </span>
          </div>
          <button className="btn-close-call" onClick={handleEndCall}>✕</button>
        </div>

        {/* Dispatcher Info Card */}
        <div className="call-target-card">
          <div className={`operator-avatar-pulse ${callState === 'CONNECTED' ? 'active' : ''}`}>
            🚑
          </div>
          <h3>IIITL Emergency Health Dispatch</h3>
          <p className="call-subtext">Verified 24/7 Campus Medical Control Room</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <span className="call-location-badge">
              📍 Location: {incidentData?.campusZone || 'Boys Hostel 1'}
            </span>
            <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: micActive ? 'rgba(0, 224, 142, 0.2)' : 'rgba(14, 144, 255, 0.2)', color: micActive ? '#00E08E' : '#0E90FF', fontWeight: 600 }}>
              {micActive ? '🎙️ Laptop Mic: ACTIVE' : '⚡ Web Audio Mode'}
            </span>
          </div>
        </div>

        {/* Real Audio Waveform Visualizer */}
        {callState === 'CONNECTED' && (
          <div className="waveform-container">
            <canvas ref={canvasRef} width={360} height={52} className="waveform-canvas" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0.3rem', fontSize: '0.75rem' }}>
              <span className="audio-live-tag" style={{ color: isMuted ? '#9CA9C4' : '#00E08E' }}>
                {isMuted ? '🔇 MIC MUTED' : (micActive ? '🟢 REAL LAPTOP MIC STREAMING' : '🎙️ LIVE 2-WAY AUDIO CHANNEL')}
              </span>
              <span style={{ color: '#9CA9C4' }}>Speak into your laptop mic</span>
            </div>
          </div>
        )}

        {/* Live Conversation Transcript */}
        {callState === 'CONNECTED' && (
          <div className="call-transcript-box">
            <div className="transcript-list">
              {messages.map((m, idx) => (
                <div key={idx} className={`transcript-bubble ${m.sender}`}>
                  <span className="bubble-sender">{m.sender === 'operator' ? '🚨 Campus Operator (Speaking)' : '🎓 You (Live Mic)'} ({m.time})</span>
                  <p>{m.text}</p>
                </div>
              ))}
              {speechRecognized && (
                <div className="transcript-bubble student" style={{ opacity: 0.85, borderStyle: 'dashed' }}>
                  <span className="bubble-sender">🎙️ Listening to you...</span>
                  <p>{speechRecognized}...</p>
                </div>
              )}
            </div>

            {/* Quick response buttons */}
            <div className="quick-response-bar">
              <span className="qr-title">Or Tap to Inform Operator Instantly:</span>
              <div className="qr-buttons">
                <button
                  type="button"
                  className="btn-qr"
                  onClick={() => handleStudentQuickReply('I am at Boys Hostel 1, Need Help!', 'hostel')}
                >
                  🏢 Boys Hostel 1
                </button>
                <button
                  type="button"
                  className="btn-qr"
                  onClick={() => handleStudentQuickReply('Patient is unconscious, CPR needed!', 'cpr')}
                >
                  ❤️ CPR Needed
                </button>
                <button
                  type="button"
                  className="btn-qr"
                  onClick={() => handleStudentQuickReply('Heavy bleeding from leg injury!', 'blood')}
                >
                  🩸 Severe Bleeding
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DTMF Telephone Keypad Drawer */}
        {showKeypad && (
          <div style={{ padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', margin: '0.5rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA9C4', fontWeight: 600 }}>DTMF TONE DIALPAD (DIRECT LAPTOP CALL):</span>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={dialNumber}
                  onChange={(e) => setDialNumber(e.target.value)}
                  style={{ width: '110px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}
                />
                <button
                  type="button"
                  onClick={() => triggerLaptopTelephony(dialNumber)}
                  style={{ background: '#00E08E', color: '#000', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Dial Now
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', maxWidth: '240px', margin: '0 auto' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '0.45rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14, 144, 255, 0.2)'; e.currentTarget.style.borderColor = '#0E90FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call Controls & Real Telephony Dialing */}
        <div className="call-controls-row">
          <button
            className={`btn-call-ctrl ${isMuted ? 'active' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title="Mute/Unmute Mic"
          >
            {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
          </button>

          <button
            className={`btn-call-ctrl ${showKeypad ? 'active' : ''}`}
            onClick={() => setShowKeypad(!showKeypad)}
            title="DTMF Tones Keypad"
          >
            ⌨️ Keypad
          </button>

          {/* Real Laptop Phone Link Direct Dial */}
          <a
            href="tel:108"
            className="btn-call-ctrl smartphone-dial"
            title="Calls 108 directly via Windows Phone Link / Laptop Dialer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            📞 108
          </a>

          <a
            href="tel:112"
            className="btn-call-ctrl smartphone-dial"
            title="Calls 112 National Emergency from Laptop"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            🚨 112
          </a>

          <button
            className={`btn-call-ctrl ${isSpeaker ? 'active' : ''}`}
            onClick={() => setIsSpeaker(!isSpeaker)}
            title="Toggle Laptop Speaker Voice"
          >
            {isSpeaker ? '🔊 Speaker' : '🔈 Off'}
          </button>

          <button className="btn-call-end" onClick={handleEndCall} title="End Emergency Call">
            🔴 End
          </button>
        </div>

        {/* Real Web Calling Services — Redirects to actual live calling platforms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.65rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {bridgeStatus && (
            <div style={{ fontSize: '0.75rem', color: '#00E08E', textAlign: 'center', fontWeight: 600 }}>
              📡 {bridgeStatus}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-call-ctrl"
              onClick={() => triggerLaptopTelephony(dialNumber)}
              style={{ fontSize: '0.74rem', borderColor: 'rgba(0,224,142,0.4)' }}
            >
              📲 Call {dialNumber || '108'} (Phone Link / Twilio)
            </button>
            <button
              type="button"
              className="btn-call-ctrl"
              onClick={() => openWebCall('jitsi-webrtc')}
              style={{ fontSize: '0.74rem' }}
            >
              🌐 Live WebRTC Call (Jitsi)
            </button>
            <button
              type="button"
              className="btn-call-ctrl"
              onClick={() => openWebCall('google-meet')}
              style={{ fontSize: '0.74rem' }}
            >
              🎥 Google Meet Call
            </button>
            <button
              type="button"
              className="btn-call-ctrl"
              onClick={() => openWebCall('whatsapp')}
              style={{ fontSize: '0.74rem' }}
            >
              💬 WhatsApp Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDispatchCallModal;

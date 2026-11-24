import { useState, useEffect, useRef } from 'react';
import soundFX from '../utils/audioFX';
import API from '../api/axios';

const AudioDispatchCallModal = ({ isOpen, onClose, incidentData }) => {
  const [callState, setCallState] = useState('DIALING'); // 'DIALING' | 'RINGING' | 'CONNECTED' | 'ENDED'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [messages, setMessages] = useState([]);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);

  // Initialize and run call lifecycle
  useEffect(() => {
    if (!isOpen) {
      setCallState('DIALING');
      setCallDuration(0);
      setMessages([]);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
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

        setMessages([
          {
            sender: 'operator',
            text: '🚨 MediGuard Emergency Dispatch. We have received your alert. Can you state your condition and campus building?',
            time: 'Just now'
          }
        ]);

        // Notify backend of active call
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
      }, 3500);

      return () => clearTimeout(connectTimeout);
    }, 1800);

    return () => {
      clearTimeout(ringTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOpen]);

  // Audio Waveform Animation on Canvas
  useEffect(() => {
    if (callState !== 'CONNECTED' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = isMuted
          ? 4
          : Math.sin(phase + i * 0.4) * 18 + Math.random() * 12 + 6;
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = isMuted ? '#4a5568' : '#00d085';
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }
      phase += 0.15;
      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [callState, isMuted]);

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleStudentQuickReply = (text, replyType) => {
    soundFX.playDialTone();
    const newMsgs = [
      ...messages,
      { sender: 'student', text, time: formatTime(callDuration) }
    ];
    setMessages(newMsgs);

    setTimeout(() => {
      let operatorReply = 'Understood. Dispatching on-campus ambulance unit immediately. Stand by!';
      if (replyType === 'cpr') {
        operatorReply = '🚨 CPR protocol activated! Begin 30 chest compressions at 100-120 BPM immediately. Paramedics are en route with an AED!';
      } else if (replyType === 'hostel') {
        operatorReply = 'Noted. Hostel Warden and emergency response team have been notified. Stay where you are.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'operator', text: operatorReply, time: formatTime(callDuration + 1) }
      ]);
    }, 1200);
  };

  const handleEndCall = () => {
    soundFX.playCountdownBeep(true);
    setCallState('ENDED');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={handleEndCall}>
      <div className="modal-content audio-call-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Call Header */}
        <div className="call-header">
          <div className="call-status-indicator">
            <span className={`call-dot ${callState.toLowerCase()}`}></span>
            <span className="call-state-text">
              {callState === 'DIALING' && 'DIALING CAMPUS DISPATCH...'}
              {callState === 'RINGING' && 'RINGING OPERATOR (108 / IIITL ER)...'}
              {callState === 'CONNECTED' && `LIVE CALL • ${formatTime(callDuration)}`}
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
          <span className="call-location-badge">
            📍 Location: {incidentData?.campusZone || 'Academic Block'}
          </span>
        </div>

        {/* Audio Visualizer */}
        {callState === 'CONNECTED' && (
          <div className="waveform-container">
            <canvas ref={canvasRef} width={340} height={46} className="waveform-canvas" />
            <span className="audio-live-tag">{isMuted ? 'MIC MUTED' : 'LIVE 2-WAY AUDIO CHANNEL'}</span>
          </div>
        )}

        {/* Live Conversation Transcript */}
        {callState === 'CONNECTED' && (
          <div className="call-transcript-box">
            <div className="transcript-list">
              {messages.map((m, idx) => (
                <div key={idx} className={`transcript-bubble ${m.sender}`}>
                  <span className="bubble-sender">{m.sender === 'operator' ? '🚨 Operator' : '🎓 You'} ({m.time})</span>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>

            {/* Quick response buttons */}
            <div className="quick-response-bar">
              <span className="qr-title">Tap to inform operator:</span>
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
                  onClick={() => handleStudentQuickReply('At Academic Block Ground Floor.', 'location')}
                >
                  🏫 Academic Block
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="call-controls-row">
          <button
            className={`btn-call-ctrl ${isMuted ? 'active' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title="Mute/Unmute Mic"
          >
            {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
          </button>

          <a href="tel:108" className="btn-call-ctrl smartphone-dial" title="Direct Phone Call">
            📱 Dial 108
          </a>

          <button
            className={`btn-call-ctrl ${isSpeaker ? 'active' : ''}`}
            onClick={() => setIsSpeaker(!isSpeaker)}
            title="Speaker"
          >
            🔊 Speaker
          </button>

          <button className="btn-call-end" onClick={handleEndCall} title="End Emergency Call">
            🔴 End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioDispatchCallModal;

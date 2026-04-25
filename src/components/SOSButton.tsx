import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { CheckCircle2 } from 'lucide-react';
import './SOSButton.css';

export const SOSButton: React.FC = () => {
  const { triggerSOS, sosActive } = useAppContext();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggerTime, setTriggerTime] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const holdDuration = 2000; // 2 seconds to trigger
  const updateInterval = 50;
  let timer: ReturnType<typeof setTimeout>;

  const handleStart = () => {
    if (sosActive || sending) return;
    setHolding(true);
    let currentProgress = 0;
    
    timer = setInterval(() => {
      currentProgress += (updateInterval / holdDuration) * 100;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setHolding(false);
        setProgress(100);
        executeSOS();
      } else {
        setProgress(currentProgress);
      }
    }, updateInterval);
  };

  const executeSOS = async () => {
    setSending(true);
    // Add artificial delay to show "Sending..." state
    setTimeout(async () => {
      await triggerSOS();
      setTriggerTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSending(false);
    }, 1500);
  };

  const handleEnd = () => {
    if (!sosActive && !sending) {
      clearInterval(timer);
      setHolding(false);
      setProgress(0);
    }
  };

  return (
    <div className="sos-wrapper">
      <div 
        className={`sos-btn ${sosActive ? 'active' : ''} ${holding ? 'holding' : ''} ${sending ? 'sending' : ''}`}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        <div className="sos-bg" style={{ transform: `scale(${1 + progress / 100})` }} />
        <div className="sos-content">
          {sosActive ? (
            <div className="sos-success-ui animate-fade-in">
              <CheckCircle2 size={32} className="mb-2" />
              <span>Alert Sent</span>
            </div>
          ) : sending ? (
            <div className="sos-sending-ui animate-fade-in">
              <div className="spinner"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <span>Hold to Activate</span>
          )}
        </div>
        
        {holding && !sosActive && !sending && (
          <svg className="progress-ring">
            <circle 
              className="progress-ring-circle" 
              strokeDasharray="314" 
              strokeDashoffset={314 - (314 * progress) / 100} 
            />
          </svg>
        )}
      </div>
      {sosActive && (
        <div className="sos-status-panel animate-slide-up">
          <p className="sos-status-text">Emergency contacts notified.</p>
          <p className="sos-status-time">Triggered at: {triggerTime}</p>
        </div>
      )}
    </div>
  );
};

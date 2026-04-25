import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Eye, Play } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import './ThreatDetection.css';

type ThreatState = 'MONITORING' | 'SUSPICIOUS' | 'THREAT';

export const ThreatDetection: React.FC = () => {
  const { triggerSOS, sosActive } = useAppContext();
  const [threatState, setThreatState] = useState<ThreatState>('MONITORING');
  const [countdown, setCountdown] = useState(10); // Shorter countdown for real flow

  const triggerManualSimulation = () => {
    if (threatState !== 'MONITORING') return;
    setThreatState('SUSPICIOUS');
    
    // Escalate to THREAT after a few seconds of SUSPICIOUS
    setTimeout(() => {
      setThreatState(current => current === 'SUSPICIOUS' ? 'THREAT' : current);
    }, 4000);
  };

  useEffect(() => {
    if (threatState === 'THREAT' && !sosActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (threatState === 'THREAT' && countdown === 0 && !sosActive) {
      triggerSOS();
      setThreatState('MONITORING');
    }
  }, [threatState, countdown, sosActive, triggerSOS]);

  const cancelThreat = () => {
    setThreatState('MONITORING');
    setCountdown(10);
  };

  if (sosActive) return null;

  if (threatState === 'MONITORING') {
    return (
      <div className="monitoring-status" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity className="monitor-icon" />
          <span>AI Environment Monitoring Active</span>
        </div>
        <button 
          onClick={triggerManualSimulation}
          style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
        >
          <Play size={10} /> Test Threat Detection
        </button>
      </div>
    );
  }

  if (threatState === 'SUSPICIOUS') {
    return (
      <div className="monitoring-status suspicious-status animate-fade-in">
        <Eye className="monitor-icon warning-icon" />
        <span>Analyzing Suspicious Audio Patterns...</span>
      </div>
    );
  }

  return (
    <div className="threat-alert animate-slide-up">
      <AlertTriangle className="alert-icon" />
      <div className="alert-content">
        <h3>High Stress Detected</h3>
        <p>Auto-SOS in <strong className="countdown-text">{countdown}s</strong></p>
      </div>
      <button className="cancel-btn" onClick={cancelThreat}>
        Cancel
      </button>
    </div>
  );
};


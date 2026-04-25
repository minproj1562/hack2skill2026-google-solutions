import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Shield, Delete, Fingerprint } from 'lucide-react';
import './PinEntry.css';

export const PinEntry: React.FC = () => {
  const { setMode } = useAppContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PIN = '0000'; // Hardcoded for prototype

  const handlePress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setTimeout(() => setMode('SAFETY'), 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            // Fake pin goes back to news app to hide intent
            setMode('NEWS');
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleBiometric = () => {
    // Simulate biometric scan success
    setTimeout(() => setMode('SAFETY'), 800);
  };

  return (
    <div className="pin-screen animate-fade-in">
      <div className="pin-header">
        <Shield className="lock-icon" />
        <h2>Secure Area</h2>
        <p>Enter PIN or use biometrics to continue</p>
      </div>

      <div className={`pin-dots ${error ? 'error-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>

      <div className="numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} className="num-btn" onClick={() => handlePress(num.toString())}>
            {num}
          </button>
        ))}
        <button className="num-btn icon-btn" onClick={handleBiometric}>
          <Fingerprint />
        </button>
        <button className="num-btn" onClick={() => handlePress('0')}>0</button>
        <button className="num-btn icon-btn" onClick={handleDelete}>
          <Delete />
        </button>
      </div>
    </div>
  );
};

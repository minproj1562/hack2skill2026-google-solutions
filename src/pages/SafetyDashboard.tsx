import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ShieldAlert, Users, Mic, MessageSquare, MapPin, X } from 'lucide-react';
import { SOSButton } from '../components/SOSButton';
import { ThreatDetection } from '../components/ThreatDetection';
import { AICounselor } from '../components/AICounselor';
import { TrustedContacts } from '../components/TrustedContacts';
import { EvidenceCollection } from '../components/EvidenceCollection';
import './SafetyDashboard.css';

type Tab = 'DASHBOARD' | 'CONTACTS' | 'COUNSELOR' | 'MAP' | 'EVIDENCE';

export const SafetyDashboard: React.FC = () => {
  const { setMode, isOffline } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return (
          <>
            <ThreatDetection />
            <div className="sos-container">
              <SOSButton />
            </div>
            
            <div className="quick-actions">
              <button className="action-card" onClick={() => setActiveTab('COUNSELOR')}>
                <MessageSquare className="action-icon text-blue" />
                <span>AI Counselor</span>
              </button>
              <button className="action-card" onClick={() => setActiveTab('EVIDENCE')}>
                <Mic className="action-icon text-purple" />
                <span>Evidence</span>
              </button>
              <button className="action-card" onClick={() => setActiveTab('CONTACTS')}>
                <Users className="action-icon text-green" />
                <span>Contacts</span>
              </button>
              <button className="action-card" onClick={() => setActiveTab('MAP')}>
                <MapPin className="action-icon text-orange" />
                <span>Safe Places</span>
              </button>
            </div>
          </>
        );
      case 'CONTACTS':
        return <TrustedContacts onBack={() => setActiveTab('DASHBOARD')} />;
      case 'COUNSELOR':
        return <AICounselor onBack={() => setActiveTab('DASHBOARD')} />;
      case 'EVIDENCE':
        return <EvidenceCollection onBack={() => setActiveTab('DASHBOARD')} />;
      case 'MAP':
        return (
          <div className="placeholder-screen animate-fade-in">
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
              <MapPin size={28} className="text-orange" />
              <h2 style={{margin: 0}}>Safe Locations</h2>
            </div>
            
            <div className="safe-locations-list" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="location-card" style={{ backgroundColor: '#27272a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #3f3f46', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e4e4e7' }}>Central Police Station</h3>
                  <span style={{ backgroundColor: '#3f3f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>0.8 mi</span>
                </div>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem' }}>Open 24/7 • Safe Zone</p>
                <button style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Get Directions</button>
              </div>

              <div className="location-card" style={{ backgroundColor: '#27272a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #3f3f46', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e4e4e7' }}>Women's Shelter Hope</h3>
                  <span style={{ backgroundColor: '#3f3f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#f97316' }}>1.2 mi</span>
                </div>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.85rem' }}>Confidential NGO • Immediate Intake</p>
                <button style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', backgroundColor: '#3f3f46', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Get Directions</button>
              </div>
            </div>

            <button className="back-btn mt-4" style={{ marginTop: '2rem' }} onClick={() => setActiveTab('DASHBOARD')}>Back to Dashboard</button>
          </div>
        );
    }
  };

  return (
    <div className="safety-dashboard animate-fade-in">
      <header className="safety-header">
        <div className="header-left">
          <ShieldAlert className="header-icon" />
          <h1>Guardian</h1>
        </div>
        <div className="header-right">
          {isOffline && <span className="offline-badge">Offline Mode</span>}
          <button className="exit-btn" onClick={() => setMode('NEWS')} title="Quick Exit">
            <X />
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {renderTabContent()}
      </main>
    </div>
  );
};


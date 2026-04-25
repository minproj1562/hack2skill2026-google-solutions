import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDocument, getDocuments, deleteDocument } from '../firebase';

type AppMode = 'NEWS' | 'PIN_ENTRY' | 'SAFETY';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isOffline: boolean;
  triggerSOS: () => Promise<void>;
  sosActive: boolean;
  contacts: any[];
  addContact: (name: string, phone: string) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('NEWS');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [sosActive, setSosActive] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial fetch
    const loadContacts = async () => {
      const data = await getDocuments('contacts');
      setContacts(data);
    };
    loadContacts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSOS = async () => {
    setSosActive(true);
    const location = { lat: 37.7749, lng: -122.4194 }; // Mock location
    const timestamp = new Date().toISOString();
    
    await addDocument('alerts', {
      type: 'SOS',
      timestamp,
      location,
      status: 'active',
      offline: isOffline
    });
    
    console.log("SOS Triggered and saved to Firestore.");
  };

  const addContact = async (name: string, phone: string) => {
    const newContact = await addDocument('contacts', { name, phone, relation: 'Added' });
    setContacts(prev => [...prev, newContact]);
  };

  const removeContact = async (id: string) => {
    await deleteDocument('contacts', id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AppContext.Provider value={{ mode, setMode, isOffline, triggerSOS, sosActive, contacts, addContact, removeContact }}>
      <div className={`app-container ${mode === 'SAFETY' ? 'safety-mode' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

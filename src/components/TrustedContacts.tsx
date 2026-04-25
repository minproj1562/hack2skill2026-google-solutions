import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Trash2, Phone } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import './TrustedContacts.css';

interface TrustedContactsProps {
  onBack: () => void;
}

export const TrustedContacts: React.FC<TrustedContactsProps> = ({ onBack }) => {
  const { contacts, addContact, removeContact } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newPhone) {
      await addContact(newName, newPhone);
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    }
  };

  const handleDelete = async (id: string) => {
    await removeContact(id);
  };

  return (
    <div className="contacts-view animate-fade-in">
      <div className="view-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft /></button>
        <h2>Trusted Contacts</h2>
        <button className="icon-btn" onClick={() => setShowAdd(!showAdd)}><UserPlus /></button>
      </div>

      {showAdd && (
        <form className="add-contact-form animate-slide-up" onSubmit={handleAdd}>
          <input 
            type="text" 
            placeholder="Name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={newPhone} 
            onChange={(e) => setNewPhone(e.target.value)}
            required
          />
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="save-btn">Save Contact</button>
          </div>
        </form>
      )}

      <div className="contacts-list">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="contact-info">
              <div className="avatar">{contact.name.charAt(0)}</div>
              <div>
                <h3>{contact.name}</h3>
                <p>{contact.phone}</p>
              </div>
            </div>
            <div className="contact-actions">
              <button className="action-icon-btn"><Phone size={18} /></button>
              <button className="action-icon-btn text-red" onClick={() => handleDelete(contact.id)}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="empty-state">
            <p>No trusted contacts added.</p>
          </div>
        )}
      </div>
    </div>
  );
};


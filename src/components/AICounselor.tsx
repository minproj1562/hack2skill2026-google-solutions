import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import './AICounselor.css';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface AICounselorProps {
  onBack: () => void;
}



export const AICounselor: React.FC<AICounselorProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello. I am your secure AI assistant. How can I help you stay safe today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('scared') || lowerText.includes('afraid')) {
      return "It's completely normal to feel scared. Please ensure you are in a safe room if possible. Would you like me to show you nearby safe locations?";
    }
    if (lowerText.includes('help') || lowerText.includes('emergency')) {
      return "If you are in immediate danger, please press and hold the SOS button on your dashboard to instantly notify your trusted contacts.";
    }
    if (lowerText.includes('leave') || lowerText.includes('escape')) {
      return "If you are planning to leave, make sure you have your important documents and a safe destination in mind. Use the map to find nearby shelters.";
    }
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hello. I'm here to support you. You can talk to me safely. Nothing is saved to your phone's main history.";
    }
    return "I am listening. Please let me know what you need. Remember your safety is the highest priority right now.";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateResponse(userMessage.text);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: responseText };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="counselor-view animate-fade-in">
      <div className="view-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft /></button>
        <h2>Secure Chat</h2>
        <div className="header-status">Encrypted</div>
      </div>

      <div className="chat-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="message-content">
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-bubble ai typing">
            <div className="message-avatar"><Bot size={18} /></div>
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type your message safely..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

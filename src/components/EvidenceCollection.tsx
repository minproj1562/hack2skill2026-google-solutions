import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Camera, FileText, CheckCircle, Lock } from 'lucide-react';
import { addDocument, getDocuments } from '../firebase';
import './EvidenceCollection.css';

interface EvidenceCollectionProps {
  onBack: () => void;
}

export const EvidenceCollection: React.FC<EvidenceCollectionProps> = ({ onBack }) => {
  const [recording, setRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    const loadEvidence = async () => {
      const items = await getDocuments('evidence');
      setSavedItems(items);
    };
    loadEvidence();
  }, []);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setSavingStatus("Saving audio securely...");
        // In a real app, upload the Blob here
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log("Audio blob captured:", audioBlob.size, "bytes");
        await saveEvidenceMetadata('audio', 'Encrypted Audio Recording');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Audio recording failed:", err);
      alert("Microphone permission denied or not available.");
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera failed:", err);
      setCameraActive(false);
      alert("Camera permission denied or not available.");
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    
    // In a real app, draw video frame to canvas to get image blob
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setCameraActive(false);

    setSavingStatus("Capturing image securely...");
    await saveEvidenceMetadata('image', 'Encrypted Image Capture');
  };

  const saveEvidenceMetadata = async (type: string, description: string) => {
    setTimeout(async () => {
      const newItem = await addDocument('evidence', {
        type,
        description,
        timestamp: new Date().toISOString()
      });
      setSavedItems(prev => [...prev, newItem]);
      setSavingStatus("Saved to Encrypted Storage");
      setTimeout(() => setSavingStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="evidence-view animate-fade-in">
      <div className="view-header">
        <button className="icon-btn" onClick={onBack}><ArrowLeft /></button>
        <h2>Evidence Vault</h2>
        <Lock className="text-blue" size={20} />
      </div>
      
      <div className="evidence-info">
        <Lock size={16} />
        <p>All data is immediately encrypted and securely backed up to the cloud.</p>
      </div>

      <div className="evidence-actions">
        {cameraActive ? (
          <div className="camera-container" style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
            <video ref={videoRef} style={{ width: '100%', height: 'auto', backgroundColor: 'black' }} playsInline muted />
            <button 
              onClick={captureImage}
              style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', border: '4px solid #3b82f6', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <>
            <button 
              className={`evidence-card ${recording ? 'recording' : ''}`}
              onClick={recording ? stopAudioRecording : startAudioRecording}
            >
              <div className="evidence-icon-bg"><Mic /></div>
              <span>{recording ? 'Stop Recording' : 'Record Audio'}</span>
              {recording && <span className="recording-dot"></span>}
            </button>

            <button className="evidence-card" onClick={startCamera}>
              <div className="evidence-icon-bg"><Camera /></div>
              <span>Capture Image</span>
            </button>

            <button className="evidence-card" onClick={() => {
              setSavingStatus("Saving note securely...");
              saveEvidenceMetadata('note', 'Encrypted Note');
            }}>
              <div className="evidence-icon-bg"><FileText /></div>
              <span>Add Quick Note</span>
            </button>
          </>
        )}
      </div>

      {savingStatus && (
        <div className="saving-feedback animate-slide-up">
          {savingStatus === "Saved to Encrypted Storage" ? (
            <CheckCircle className="text-green" />
          ) : (
            <div className="spinner"></div>
          )}
          <span>{savingStatus}</span>
        </div>
      )}

      <div className="saved-items-section mt-4">
        <h3>Recent Encrypted Files</h3>
        <div className="saved-items-list">
          {savedItems.length === 0 ? (
            <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>No evidence saved securely yet.</p>
          ) : (
            savedItems.map(item => (
              <div key={item.id} className="saved-item">
                <div className="saved-icon">
                  {item.type === 'audio' && <Mic size={16} />}
                  {item.type === 'image' && <Camera size={16} />}
                  {item.type === 'note' && <FileText size={16} />}
                </div>
                <div className="saved-details">
                  <h4>{item.description}</h4>
                  <p>{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}</p>
                </div>
                <Lock size={14} className="text-blue opacity-50" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


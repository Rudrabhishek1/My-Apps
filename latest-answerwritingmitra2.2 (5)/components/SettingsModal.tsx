import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialApiKey }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Card className="w-[calc(100vw-2rem)] max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your API key is stored securely in your browser's local storage and is never sent to our servers.
              You can get a free Google Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
            </p>
            <Input
              label="Google Gemini API Key"
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here"
            />
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button onClick={handleSave}>Save Key</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsModal;
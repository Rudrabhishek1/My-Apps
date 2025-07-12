import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Last Updated: [Date]</strong></p>
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service.</p>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">1. Data We Collect and Use</h3>
            <p><strong>User-Provided Content:</strong> The exam configuration, questions, and answers you provide are sent to our secure backend service. This service uses this information to communicate with the Google Gemini API to generate your evaluation. Your content is used in-memory to process your request and is not stored on our servers or logged.</p>
            <p><strong>API Keys:</strong> This application is powered by the Google Gemini API. We manage the necessary API keys securely on our backend. You are not required to provide your own API key.</p>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">2. Third-Party Services</h3>
            <p><strong>Google Gemini API:</strong> Your interactions with the AI are processed by Google. We recommend you review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google's Privacy Policy</a>.</p>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">3. Advertising and Cookies</h3>
            <p>We use third-party advertising companies, such as Google AdSense, to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ads Settings</a>.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">4. Changes to This Privacy Policy</h3>
            <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">5. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, you can contact us via the email links provided in the footer.</p>
          </div>
          <div className="mt-6 flex justify-end gap-4 flex-shrink-0">
            <Button onClick={onClose}>Close</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;

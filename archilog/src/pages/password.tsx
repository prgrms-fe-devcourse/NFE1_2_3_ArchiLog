import React from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetEmail: string;
  resetUsername: string; 
  setResetEmail: React.Dispatch<React.SetStateAction<string>>;
  setResetUsername: React.Dispatch<React.SetStateAction<string>>;
  handleSendCode: () => Promise<void>;
  verificationMessage: string | null;
  setVerificationMessage: React.Dispatch<React.SetStateAction<string | null>>; 
  isCodeSent: boolean; 
  darkMode: boolean; 
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  resetEmail,
  resetUsername,
  setResetEmail,
  setResetUsername,
  handleSendCode,
  verificationMessage,
  setVerificationMessage,
  isCodeSent, 
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
      <div className={`relative ${darkMode ? 'bg-[#395372]' : 'bg-white'} p-6 rounded-lg w-[90%] max-w-md shadow-lg`}>

        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          placeholder="Enter your username" 
          value={resetUsername}
          onChange={(e) => {
            setResetUsername(e.target.value);
            setVerificationMessage(null); 
          }}
          className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={resetEmail}
          onChange={(e) => {
            setResetEmail(e.target.value);
            setVerificationMessage(null);
          }}
          className={`w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
        
        {verificationMessage && <p className="text-red-500 text-center mb-2">{verificationMessage}</p>}
        
        <button 
          onClick={handleSendCode} 
          className={`w-full py-2 ${darkMode ? 'bg-[#678bb4] text-white' : 'bg-gray-300 text-black'} rounded-md hover:bg-black hover:text-white mt-2`}>
          {isCodeSent ? "Resend Verification Code" : "Send Verification Code"}
        </button>

      </div>
    </div>
  );
};

export default ForgotPasswordModal;


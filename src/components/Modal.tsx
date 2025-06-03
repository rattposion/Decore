import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-modalIn">
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">×</button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s; }
        @keyframes modalIn { from { transform: translateY(40px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-modalIn { animation: modalIn 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  );
};

export default Modal; 
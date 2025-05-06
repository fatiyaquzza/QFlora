import React from "react";

function Modal({ show, title, children, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md animate-fade-in">
        <div className="flex items-center justify-between pb-2 mb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-400 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;

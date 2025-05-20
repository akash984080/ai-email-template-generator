import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[80%] max-w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

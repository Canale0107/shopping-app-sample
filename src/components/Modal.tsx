import React from "react";

export const Modal: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  style?: React.CSSProperties;
}> = ({ children, onClose, style }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div
      className="modal-content"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

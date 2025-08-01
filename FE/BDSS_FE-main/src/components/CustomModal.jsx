import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./CustomModal.css";

const CustomModal = ({
  show,
  onHide,
  title,
  children,
  size = "large",
  headerClass = "",
  bodyClass = "",
  footerClass = "",
  footer,
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [show]);

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onHide();
    }
  };

  // Prevent wheel events from bubbling to the backdrop
  const handleModalWheel = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
      <div className={`custom-modal ${size}`} onWheel={handleModalWheel}>
        <div className="custom-modal-content">
          {/* Header */}
          <div className={`custom-modal-header ${headerClass}`}>
            <div className="custom-modal-title">{title}</div>
            <button
              className="custom-modal-close-btn"
              onClick={onHide}
              type="button"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className={`custom-modal-body ${bodyClass}`}>{children}</div>

          {/* Footer */}
          {footer && (
            <div className={`custom-modal-footer ${footerClass}`}>{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

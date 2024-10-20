import React from 'react';
import './Styles/PopUp.css'; 

function SuccessPopup({ trigger, onClose, warning }) {
    return (trigger) ? (
        <div className="success-popup">
            <div className="success-popup-inner">
                <button className="close-x" onClick={onClose}>×</button>
                <h2 style={{ color: 'black' }}>File Uploaded Successfully!</h2>
                <p>Your teams have successfully been made.</p>
                {warning && <p className="error-message">{warning}</p>}
                <button className="success-close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    ) : "";
}
export default SuccessPopup;
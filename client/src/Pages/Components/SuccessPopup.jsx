import React from 'react';
import './Styles/PopUp.css'; // You can create a separate CSS file for styling

function SuccessPopup({ trigger, onClose, warning }) {
    return (trigger) ? (
        <div className="success-popup">
            <div className="success-popup-inner">
                {/* X button to close the success popup */}
                <button className="close-x" onClick={onClose}>×</button>
                <h2 style={{ color: 'black' }}>File Uploaded Successfully!</h2>
                <p>Your CSV file has been successfully parsed and processed.</p>
                {warning && <p className="error-message">{warning}</p>}
                <button className="success-close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    ) : "";
}

export default SuccessPopup;
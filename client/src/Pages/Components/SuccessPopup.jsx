import React from 'react';
import './Styles/PopUp.css'; 
import { useState } from 'react';
import PropTypes from 'prop-types';

function SuccessPopup({ trigger, onClose, warning }) {

    //prop validation
    SuccessPopup.propTypes = {
        trigger: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        warning: PropTypes.string,
    };
    if(warning  == null){
        warning = "Your teams have successfully been made";
    }

    return (trigger) ? (
        <div className="success-popup">
            <div className="success-popup-inner">
                <button className="close-x" onClick={onClose}>×</button>
                <h2 style={{ color: 'black' }}>{warning =="Your teams have successfully been made"? "File Upload Successful": "Error"}</h2>
                {warning && <p className="error-message">{warning}</p>}
                <button className="success-close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    ) : "";
}
export default SuccessPopup;
import './Styles/PopUp.css';
import PropTypes from 'prop-types';

function SuccessPopup({ trigger, onClose, warning }) {

    //prop validation
    SuccessPopup.propTypes = {
        trigger: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        warning: PropTypes.string,
    };
    if (warning == null) {
        warning = `Teams were succefully added.
The members that dind't have an account were created and notified by email.`;
    }

    return (trigger) ? (
        <div className="success-popup">
            <div className="success-popup-inner">
                <button className="close-x" onClick={onClose}>×</button>
                <h2 style={{ color: 'black' }}>{warning != null ? "File Upload Successful" : "Error"}</h2>
                {warning && <p className="error-message">{warning}</p>}
                <button className="success-close-button" onClick={onClose}>OK</button>
            </div>
        </div>
    ) : "";
}
export default SuccessPopup;
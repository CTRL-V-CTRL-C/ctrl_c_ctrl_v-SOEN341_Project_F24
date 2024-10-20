import PopUp from '../PopUp';
import SuccessPopup from '../SuccessPopup';
import { useState } from 'react';

function AllTeams() {

    const [buttonPopup, setButtonPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successPopupWarning, setSuccessPopupWarning] = useState("");
    
    const triggerSuccessPopup = (warning) => {
        setSuccessPopupWarning(warning); // Set the warning message
        setShowSuccessPopup(true); // Show the success popup
    };

    return (
        <div>
            <button onClick={() => setButtonPopup(true)}>Upload</button>
            {/* CSV Upload Popup */}
            <PopUp
                trigger={buttonPopup}
                setTrigger={setButtonPopup}
                triggerSuccessPopup={triggerSuccessPopup}
                setSuccessPopupWarning={setSuccessPopupWarning} // Optional: if needed in PopUp
            />
            {/* Success popup */}
            <SuccessPopup
                trigger={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                warning={successPopupWarning} // Pass the warning message to SuccessPopup
            />
        </div>
    );
}

export default AllTeams;
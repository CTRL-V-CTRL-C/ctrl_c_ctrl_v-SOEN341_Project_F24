import PopUp from '../PopUp';
import SuccessPopup from '../SuccessPopup';
import { useState } from 'react';

function AllTeams() {

    const [openUploadPopup, setButtonPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successPopupWarning, setSuccessPopupWarning] = useState("");

    const triggerSuccessPopup = (warning) => {
        setSuccessPopupWarning(warning);
        setShowSuccessPopup(true);
    };

    return (
        <div>
            <button onClick={() => setButtonPopup(true)}>Create Teams</button>
            {/* CSV Upload Popup */}
            <PopUp
                trigger={openUploadPopup}
                setTrigger={setButtonPopup}
                class
                triggerSuccessPopup={triggerSuccessPopup}
                setSuccessPopupWarning={setSuccessPopupWarning}
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

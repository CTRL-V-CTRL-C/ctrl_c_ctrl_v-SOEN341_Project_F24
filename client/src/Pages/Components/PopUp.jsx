import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleClose = (e) => {
        setFile(null); // Reset the file state
        props.setTrigger(false); // Close the popup
    };

    // const handleUpload = async () => {
    //     // We will fill this out later
    //   };

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="dropZone">
                    <h3>Drag and Drop</h3>
                    <input type="file" className="upload" onChange={handleFileChange} />
                 
                        {file && (
                              <div className="file-details">
                                File details:
                                <ul>
                                    <li>Name: {file.name}</li>
                                    <li>Type: {file.type}</li>
                                    <li>Size: {file.size} bytes</li>
                                </ul>
                                </div>
                        )}
                </div>
            </div>
            <div className="bu">
                <button className="close-btn" onClick={handleClose} >Close</button>
                {props.children}
                <button className="upload">Upload</button>
            </div>
        </div>
    ) : "";

}
export default PopUp;
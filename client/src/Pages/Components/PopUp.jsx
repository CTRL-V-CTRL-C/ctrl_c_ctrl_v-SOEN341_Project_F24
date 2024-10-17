import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {


    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);

    const handleFileChange = (file) => {
        if (file) {
            
            setError("");
            setFile(file);
        }
    };

    const handleClose = (e) => {
        setFile(null); // Reset the file state
        setError(""); // Clear any error message
        props.setTrigger(false); // Close the popup
    };

    const handleUpload = (e) => {
        const fileName = file.name;
        const fileType = file.type;

        //file validation 
        if (fileType === "text/csv" || fileName.endsWith(".csv")) {
            setError("Correct File"); // Clear error message if file is valid
        } else {
            setError("Please upload a valid CSV file."); // Set error message
        }
    };

    return (props.trigger) ? (
        <div className="popup">
            <div className={`popup-inner ${highlighted ? "border-green" : "border-gray"}`}>
                <div className={`dropZone ${highlighted ?
                    "border-green bg-green" : "border-gray"}`}

                    onDragEnter={() => {
                        setHighlighted(true);
                    }}
                    onDragLeave={() => {
                        setHighlighted(false);
                    }}

                    onDragOver={(e) => {
                        e.preventDefault();  /*preventing the default of automatically downloading*/

                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const droppedFiles = e.dataTransfer.files;
                        handleFileChange(droppedFiles[0]);
                        setHighlighted(false);
                    }}
                >
                    <h3>Drag and Drop</h3>
                    <input type="file" className="upload" onChange={(e) => handleFileChange(e.target.files[0])} />

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
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}

                </div>
            </div>
            <div className="bu">
                <button className="close-btn" onClick={handleClose} >Close</button>
                {props.children}
                <button className="upload" onClick={handleUpload}>Upload</button>
            </div>
        </div>
    ) : "";
}
export default PopUp;



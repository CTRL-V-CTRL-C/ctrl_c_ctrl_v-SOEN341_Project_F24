import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {


    const [file, setFile] = useState(null);
    const [error, setError] = useState(""); // State for error message

    const handleFileChange = (file) => {
        if (file) {
            const fileName = file.name;
            const fileType = file.type;

            // Check if the file is a CSV by extension or MIME type
            if (fileType === "text/csv" || fileName.endsWith(".csv")) {
                setFile(file);
                setError(""); // Clear error message if file is valid
            } else {
                setFile(null);
                setError("Please upload a valid CSV file."); // Set error message
            }
        }
    };

    const handleClose = (e) => {
        setFile(null); // Reset the file state
        setError(""); // Clear any error message
        props.setTrigger(false); // Close the popup
    };

    // const handleUpload = async () => {
    //     // We will fill this out later
    //   };

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="dropZone"
                
                /*overide default method */
                onDragOver = {(e) =>{
                    e.preventDefault();  /*preventing the default of automatically downloading*/
                }}
                /*overide default method */
                onDrop = {(e) => {
                    e.preventDefault(); 
                    const droppedFiles = e.dataTransfer.files;
                    console.log(droppedFiles);
                    if (droppedFiles.length > 0) {
                        handleFileChange(droppedFiles[0]); // Pass the dropped file to the handler
                    }
                    
                    
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
                <button className="upload">Upload</button>
            </div>
        </div>
    ) : "";

}
export default PopUp;
import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const teams = [];
    const class_ID = "";
    
        // Prevent the file from being opened/downloaded when file is dropped outside the popup
        const handleDragOver = (e) => {
            e.preventDefault();  
        };
        const handleDrop = (e) => {
            e.preventDefault();  
            e.stopPropagation(); 
        };
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);
        
    const handleFileChange = (file) => {
        if (file) {

            setError("");// Clear any error message
            setFile(file);//set file state
        }
    };

    const handleClose = (e) => {
        setFile(null); // Reset the file state
        setError(""); 
        props.setTrigger(false); // Close the popup
    };

    const handleUpload = (e) => {
        
        //Check to see if there is a file before uploading
        if (!file) {
            setError("Please select a file before uploading.");
            return;
        }
        const fileName = file.name;
        const fileType = file.type;

        //file validation 
        if (fileType === "text/csv" || fileName.endsWith(".csv")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                let text = e.target.result;

                //check for Byte Order Mark and remove if it is present 
                if (text.charCodeAt(0) === 0xFEFF) {
                    text = text.slice(1); // Remove BOM
                }

                let warnings = [];
                parseCSV(text, warnings); // Pass the warnings array
                handleClose(e);

                if (warnings.length > 0) {
                    props.triggerSuccessPopup(warnings[0]); // Pass warnings to the success popup
                } else {
                    props.triggerSuccessPopup(null); 
                }

                /********************************************add code to send teams array to API********************************** */

            };
            reader.readAsText(file, 'utf-8');
        } else {
            setError("Please upload a valid CSV file."); 
        }
    };
    //function to parse the cvs file
    const parseCSV = (data, warnings) => {
        const lines = data.split("\n");

        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header row
            const line = lines[i].trim();

            // Skip empty lines
            if (!line) continue;

            const [fname,lname, studentID, email, teamName] = line.split(",").map(item => item.trim().replace(/^["']|["']$/g, ""));

            // Check for missing values
            if (!fname || !lname || !email || !studentID || !teamName) {
                warnings.push("Note: Teams might not be complete. One or more rows may be missing values.");
                continue; // Skip this row if it's malformed and send an error message
            }

            let existingTeam = teams.find(team => team.name === teamName);

            if (existingTeam) {
                // If the team exists, add the member to the members array
                existingTeam.members.push({
                    fname,
                    lname,
                    email,
                    studentID
                });
            } else {
                // If the team doesn't exist, create a new team object
                teams.push({
                    name: teamName,
                    members: [{
                        fname,
                        lname,
                        email,
                        studentID
                    }]
                });
            }
        }
    };

    return (props.trigger) ? (

        <div className="popup">
            <div className={`popup-inner ${highlighted ? "border-green" : "border-outer"}`}>
                {/* X button to close the popup */}
                <button className="close-x" onClick={handleClose}>×</button>
                <h2 style={{ color: 'black' }}>Upload File</h2>
                <div className={`dropZone ${highlighted ?
                    "border-green bg-green" : "border-inner"}`}

                    onDragEnter={() => {
                        setHighlighted(true);
                    }}
                    onDragLeave={() => {
                        setHighlighted(false);
                    }}

                    onDragOver={(e) => {
                        e.preventDefault(); 

                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const droppedFiles = e.dataTransfer.files;
                        handleFileChange(droppedFiles[0]);
                        setHighlighted(false);
                    }}
                >
                    <h4 style={{ color: 'black' }}>Drag CVS file to upload</h4>
                    <div className="bu">
                        <input
                            type="file"
                            className="file-input"
                            id="fileUpload"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                        <label htmlFor="fileUpload" className="upload-button">Choose a file</label>
                        <button className="upload-button" onClick={handleUpload}>Upload</button>
                    </div>
                    <div className= "file-outline">
                    {file && (
                        <div className="file-details">
                            File details:
                            <ul>
                                <li>Name: {file.name}</li>
                                <li>Size: {file.size} bytes</li>
                            </ul>
                        </div>
                    )}
                    </div>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                </div>
            </div>
        </div>
    ) : "";
}
export default PopUp;
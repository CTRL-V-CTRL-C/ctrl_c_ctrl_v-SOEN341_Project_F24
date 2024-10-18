import React from 'react';
import { useState } from 'react'
import './Styles/PopUp.css'

function PopUp(props) {

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const teams = [];

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

          // Check if no file is selected
          if (!file) {
            setError("Please select a file before uploading.");
            return;
        }
        
        const fileName = file.name;
        const fileType = file.type;
       

        //file validation 
        if (fileType === "text/csv" || fileName.endsWith(".csv")) {
            setError("Correct File"); // for test purposes, take this out later
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;

                //check for Byte Order Mark and remove if it is present 
                if (text.charCodeAt(0) === 0xFEFF) {
                    text = text.slice(1); // Remove BOM
                }
                parseCSV(text);
                console.log(teams); // testing purposes can remove later


                //***add code to send teams array to API */


            };
            reader.readAsText(file, 'utf-8');
        } else {
            setError("Please upload a valid CSV file."); // Set error message
        }
    };
    //function to parse the cvs file
    const parseCSV = (data) => {
        const lines = data.split("\n");

        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header row
            const line = lines[i].trim();

            // Skip empty lines
            if (!line) continue;

            const [name, studentID, email, teamName] = line.split(",").map(item => item.trim());

            // Check for missing values
            if (!name || !email || !studentID || !teamName) {
                setError("Note: One or more rows are missing values. Teams might not have all memberes. Recheck the CVS file to insure all names, emails, student IDs and team names are provided");
                continue; // Skip this row if it's malformed
            }

            // Find the team object by teamName
            let existingTeam = teams.find(team => team.name === teamName);

            if (existingTeam) {
                // If the team exists, add the member to the members array
                existingTeam.members.push({
                    name,
                    email,
                    studentID
                });
            } else {
                // If the team doesn't exist, create a new team object
                teams.push({
                    name: teamName,
                    members: [{
                        name,
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
                <h2>Upload File</h2>
                <div className={`dropZone ${highlighted ?
                    "border-green bg-green" : "border-inner"}`}

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
                    <h4>Drag file to upload</h4>
                    <input
                type="file"
                className="file-input"
                id="fileUpload"
                onChange={(e) => handleFileChange(e.target.files[0])}
            />
                    <label htmlFor="fileUpload" className="upload-button">
                Choose a file
            </label>

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
                {props.children}
                <button className="upload" onClick={handleUpload}>Upload</button>
            </div>
        </div>
    ) : "";
}
export default PopUp;



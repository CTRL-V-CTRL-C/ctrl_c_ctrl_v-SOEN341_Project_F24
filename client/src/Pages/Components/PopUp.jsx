import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../Context/UserContext';
import { postData } from '../../Controller/FetchModule';
import './Styles/PopUp.css';
import PropTypes from 'prop-types';

function PopUp(props) {

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const [info, setInfo] = useState({ teams: [] });
    const userContext = useContext(UserContext);

    //prop validation
    PopUp.propTypes = {
        trigger: PropTypes.bool.isRequired,
        setTrigger: PropTypes.func.isRequired,
        triggerSuccessPopup: PropTypes.func.isRequired,
    };

    // Prevent the file from being opened/downloaded when file is dropped outside the popup
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);
    }, []);


    /**
     * @param {File} file the file to set the state
     */
    const handleFileChange = (file) => {
        setFile(file); // Set file state
    };

    const handleClose = (e) => {
        setFile(null); // Reset the file state
        setError("");
        props.setTrigger(false); // Close the popup
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError("Please select a file before uploading.");
            return;
        }
    
        const fileName = file.name;
        const fileType = file.type;
    
        if (!(fileType === "text/csv" && fileName.endsWith(".csv"))) {
            setError("File type must be CSV.");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async (event) => {
            let text = event.target.result;
    
            if (text.charCodeAt(0) === 0xFEFF) {
                text = text.slice(1); // Remove BOM if present
            }
    
            let warnings = [];
            
            // Wait for parseCSV to complete and update info
            await parseCSV(text, warnings);
            
            //if there are warnings from parsing( missing information)-send error to success popup
            if (warnings.length > 0) {
                handleClose(e);
                props.triggerSuccessPopup(warnings[0]);
            } else {
                const success = await sendData(); // Only send the data if info is updated
                if (success) {
                    handleClose(e);
                    props.triggerSuccessPopup(null);//send no errors to Success Popup
                } else {
                    setError("Error occurred while sending data to the API. Please try again."); //don't close popup if info can't send
                }
            }
        };
        reader.readAsText(file, 'utf-8');
    };
    
    // parseCSV returns a promise that resolves after info is updated
    const parseCSV = (data, warnings) => {
        return new Promise((resolve) => {
            const teamInfo = { teams: [] };
            const lines = data.split("\n");
    
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
    
                const [fname, lname, studentID, email, teamName] = line.split(",").map(item => item.trim().replace(/^["']|["']$/g, ""));
                if (!fname || !lname || !email || !studentID || !teamName) {
                    warnings.push(`Note: Missing students information on line ${i}`);
                    continue;
                }
    
                const existingTeam = teamInfo.teams.find(team => team.name === teamName);
                if (existingTeam) {
                    existingTeam.members.push({ fname, lname, email, studentID });
                } else {
                    teamInfo.teams.push({ name: teamName, members: [{ fname, lname, email, studentID }] });
                }
            }
            setInfo(teamInfo); // Update the state

            // Use a timeout to wait for the state update, then resolve
            setTimeout(() => resolve(), 0);
        });
    };
    
    
    //function to send the info to API
    async function sendData() {
        try {
            for (let team of info.teams) {
                const requestBody = {
                    teamName: team.name, // The team's name
                    members: team.members, // List of members for that team
                    courseID: userContext.selectedCourse.course_id // The course/class ID
                };
                console.log("Sending data to API:", requestBody); // Debug the request body can delete after 
                const response = await postData("/api/team/create", requestBody);
                if (response.status != 200) {
                    const error = await response.json();
                    throw new Error(error.msg);
                }
                console.log("Raw Response:", response); // Log the raw response can delete after 
            }
        } catch (err) {
            console.error("Error caught:", err); // Log any error caught
            setError(`Error uploading data: ${err.message}`);
            return;
        }
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className={`popup-inner ${highlighted ? "border-green" : "border-outer"}`}>
                {/* X button to close the popup */}
                <button className="close-x" onClick={handleClose}>×</button>
                <h2 style={{ color: 'black' }}>Upload File</h2>
                <div className={`dropZone ${highlighted ? "border-green bg-green" : "border-inner"}`}
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
                            accept=".csv"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                        <label htmlFor="fileUpload" className="upload-button">Choose a file</label>
                        <button className="upload-button" onClick={handleUpload}>Upload</button>
                    </div>
                    <div className="file-outline">
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
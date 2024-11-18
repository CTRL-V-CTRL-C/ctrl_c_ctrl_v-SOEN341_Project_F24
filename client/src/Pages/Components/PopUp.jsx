import { useEffect, useState, useContext } from 'react';
import UserContext from '../../Context/UserContext';
import { postData } from '../../Controller/FetchModule';
import './Styles/PopUp.css';
import PropTypes from 'prop-types';

function PopUp(props) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const userContext = useContext(UserContext);

    // Prop validation
    PopUp.propTypes = {
        trigger: PropTypes.bool.isRequired,
        setTrigger: PropTypes.func.isRequired,
        triggerSuccessPopup: PropTypes.func.isRequired,
        fetchTeams: PropTypes.func.isRequired
    };

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
        return () => {
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('drop', handleDrop);
        };
    }, []);

    const handleFileChange = (file) => {
        setError("");
        setFile(file);

    };

    const handleClose = () => {
        setFile(null);
        setError("");
        props.setTrigger(false);
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
                text = text.slice(1);
            }

            let warnings = [];
            const teamInfo = parseCSV(text, warnings); //Get teamInfo from parsing

            // Check for warnings
            if (warnings.length > 0) {
                handleClose();
                props.triggerSuccessPopup(warnings[0]);
            } else {
                // Call sendData with the current teamInfo
                const success = await sendData(teamInfo); //Pass the current teamInfo directly

                if (success) {
                    handleClose();
                    props.triggerSuccessPopup(null); //No errors to Success Popup
                    await props.fetchTeams(); //Call fetchTeams to refresh data
                }
            }
        };
        reader.readAsText(file, 'utf-8');
    };

    const parseCSV = (data, warnings) => {
        const teamInfo = { teams: [] };
        const lines = data.split("\n");

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [fname, lname, studentID, email, teamName] = line.split(",").map(item => item.trim().replace(/^["']|["']$/g, ""));
            if (!fname || !lname || !email || !studentID || !teamName) {
                warnings.push(`Note: Missing student information on line ${i}`);
                continue;
            }

            const existingTeam = teamInfo.teams.find(team => team.name === teamName);
            if (existingTeam) {
                existingTeam.members.push({ fname, lname, studentID, email });
            } else {
                teamInfo.teams.push({ name: teamName, members: [{ fname, lname, studentID, email }] });
            }
        }

        return teamInfo; //Return the constructed teamInfo directly
    };

    async function sendData(official_team) {
        try {
            for (let team of official_team.teams) {
                const requestBody = {
                    courseID: userContext.selectedCourse.course_id, //get class ID from context
                    teamName: team.name, // The team's name
                    //other info will be needed later
                    members: team.members.map(member => {
                        return {
                            firstName: member.fname,
                            lastName: member.lname,
                            schoolID: member.studentID,
                            email: member.email,
                            role: "STUD"
                        }
                    }),
                };
                console.log("Sending data to API:", requestBody); //Debug the request body can delete after 

                const response = await postData("/api/team/create", requestBody);
                if (response.status !== 200) {
                    continue;
                }
            }
            return true; //Return true if all teams are successfully sent
        } catch (err) {
            setError(`Error uploading data: ${err.message}`);
            return false; //Return false on any error
        }
    }

    return (props.trigger) ? (
        <div className="popup">
            <div id ='cvsInnerPopup'className={`popup-inner ${highlighted ? "border-green" : "border-outer"}`}>
                {/* X button to close the popup */}
                <button className="close-x" onClick={handleClose}>×</button>
                <h2 id='cvsTitle'style={{ color: 'black' }}>Upload File</h2>
                <div id='cvsDropZone'className={`dropZone ${highlighted ? "border-green bg-green" : "border-inner"}`}
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
                    <h4 id="cvsDragAndDrop"style={{ color: 'black' }}>Drag CVS file to upload</h4>
                    <div className="bu">
                        <input
                            type="file"
                            className="file-input"
                            id="fileUpload"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                        <label id='cvsChoseFileButton' htmlFor="fileUpload" className="upload-button">Choose a file</label>
                        <button id ='cvsUploadFileButton' className="upload-button" onClick={handleUpload}>Upload</button>
                    </div>
                    <div id ='cvsFileDetails' className="file-outline">
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
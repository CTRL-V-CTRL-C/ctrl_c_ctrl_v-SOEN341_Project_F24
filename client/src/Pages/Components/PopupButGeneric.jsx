import { useEffect, useState, useContext } from 'react';
import './Styles/PopUp.css';
import PropTypes from 'prop-types';

function PopupButGeneric({ shouldOpen, setOpen, title, fileType, onUpload, fileExtension }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [highlighted, setHighlighted] = useState(false);


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
        setOpen(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file before uploading.");
            return;
        }

        if (fileType && file.type !== fileType) {
            setError(`File type must be ${fileType}`);
            return;
        }

        if (fileExtension && !file.name.endsWith(fileExtension)) {
            setError(`File Type must have the extension ${fileExtension}`);
            return;
        }

        onUpload(file);
        setOpen(false);
    };

    if (!shouldOpen) {
        return "";
    }

    return <div className="popup">
        <div className={`popup-inner ${highlighted ? "border-green" : "border-outer"}`}>
            {/* X button to close the popup */}
            <button className="close-x" onClick={handleClose}>X</button>
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
                <h4 style={{ color: 'black' }}> {title ? title : "Drag file to upload"}</h4>
                <div className="bu">
                    <input
                        type="file"
                        className="file-input"
                        id="fileUpload"
                        accept={fileExtension}
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
}
// Prop validation
PopupButGeneric.propTypes = {
    shouldOpen: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    title: PropTypes.string,
    fileType: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
    fileExtension: PropTypes.string
};

export default PopupButGeneric;
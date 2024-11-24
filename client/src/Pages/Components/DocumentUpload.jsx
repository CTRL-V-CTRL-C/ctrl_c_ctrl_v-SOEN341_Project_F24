import './Styles/DocumentUpload.css'
import { useContext, useState } from "react";
import FileModal from "./FileModal";
import UserContext from "../../Context/UserContext";
import { postFile } from "../../Controller/FetchModule";
import PropTypes from 'prop-types';


function DocumentUpload({ onSucess }) {
    const message = "Your students already have acess to this document :)";
    const [popupOpen, setPopupOpen] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const userContext = useContext(UserContext);

    /**
     * handles the upload of the file
     * @param {File} file the file
     */
    async function handleUpload(file) {
        setUploadError("");
        const response = await postFile(`/api/document/upload/${userContext.selectedCourse.course_id}`, file);
        if (response.status === 200) {
            setSuccessMessage("The file was uploaded successfully");
            onSucess();
        } else {
            setUploadError(`${response.status} ${response.statusText}, ${await response.text()}`);
        }
    }

    return <div className="documentUpload">
        <h4>Documents</h4>

        {uploadError ? <p className="error">{message}</p> : ""}
        {successMessage ? <p className="success">{successMessage}</p> : ""}

        <button id="button" onClick={() => setPopupOpen(!popupOpen)}>Upload</button>
        <FileModal shouldOpen={popupOpen} setOpen={setPopupOpen} onUpload={handleUpload} />
    </div>
}

DocumentUpload.propTypes = {
    onSucess: PropTypes.func.isRequired
}

export default DocumentUpload;
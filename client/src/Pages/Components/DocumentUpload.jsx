import './Styles/DocumentUpload.css'
import { useContext, useState } from "react";
import FileModal from "./FileModal";
import UserContext from "../../Context/UserContext";
import { postFile } from "../../Controller/FetchModule";
import PropTypes from 'prop-types';


function DocumentUpload({ onSucess }) {
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
        setSuccessMessage("");
        const response = await postFile(`/api/document/upload/${userContext.selectedCourse.course_id}`, file);
        const text = await response.text()
        if (response.status === 200) {
            setSuccessMessage("The file was uploaded successfully");
            onSucess();
        }
        else if (text.includes("documents_course_id_document_name_key")) {
            setUploadError("Your students already have access to this document :)");
        }
        else {
            setUploadError(`${response.status} ${response.statusText}, ${text}`);
        }
    }

    return <div className="documentUpload">


        {uploadError ? <p id="errorDocumentUpload">{uploadError}</p> : ""}
        {successMessage ? <p className="success">{successMessage}</p> : ""}

        <button id="button-upload-document" onClick={() => setPopupOpen(!popupOpen)}>Upload</button>
        <FileModal shouldOpen={popupOpen} setOpen={setPopupOpen} onUpload={handleUpload} />
    </div>
}

DocumentUpload.propTypes = {
    onSucess: PropTypes.func.isRequired
}

export default DocumentUpload;
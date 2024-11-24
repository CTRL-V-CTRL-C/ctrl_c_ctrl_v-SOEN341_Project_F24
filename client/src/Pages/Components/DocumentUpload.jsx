import { useContext, useState } from "react";
import FileModal from "./FileModal";
import UserContext from "../../Context/UserContext";
import { postData, postFile } from "../../Controller/FetchModule";

function DocumentUpload() {
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
        } else {
            setUploadError(`${response.status} ${response.statusText}, ${await response.text()}`);
        }
    }

    return <div className="documentUpload">
        <h4>Documents</h4>
        {uploadError ? <p className="error">{uploadError}</p> : ""}
        {successMessage ? <p className="success">{successMessage}</p> : ""}

        <button onClick={() => setPopupOpen(!popupOpen)}>Upload</button>
        <FileModal shouldOpen={popupOpen} setOpen={setPopupOpen} onUpload={handleUpload} />
    </div>
}

export default DocumentUpload;
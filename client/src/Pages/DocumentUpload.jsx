import { useContext, useState } from "react";
import PopupButGeneric from "./Components/PopupButGeneric";
import UserContext from "../Context/UserContext";
import { postData, postFile } from "../Controller/FetchModule";

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

        try {
            const response = await postFile(`/document/upload/${userContext.selectedCourse.course_id}`, file);
            setSuccessMessage("The file was uploaded successfully");
        } catch (error) {
            setUploadError(error);
        }
    }

    return <div className="documentUpload">
        <h4>Documents</h4>
        {uploadError ? <p className="error">{uploadError}</p> : ""}
        {successMessage ? <p className="success">{successMessage}</p> : ""}

        <button onClick={() => setPopupOpen(!popupOpen)}>Upload</button>
        <PopupButGeneric shouldOpen={popupOpen} setOpen={setPopupOpen} onUpload={handleUpload} />
    </div>
}

export default DocumentUpload;
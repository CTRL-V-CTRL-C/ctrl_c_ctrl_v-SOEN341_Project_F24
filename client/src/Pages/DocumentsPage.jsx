import { useContext } from "react";
import DocumentUpload from "./Components/DocumentUpload";
import UserContext from "../Context/UserContext";

export default function DocumentsPage() {
    const userContext = useContext(UserContext);

    return (
        <div id="documents-page">
            {userContext.isInstructor ? <DocumentUpload /> : ""};
            TODO: actually show the uploaded documents
        </div>
    )
}
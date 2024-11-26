import { useCallback, useContext, useEffect, useState } from "react";
import { fetchData } from "../Controller/FetchModule.js";
import DocumentUpload from "./Components/DocumentUpload";
import UserContext from "../Context/UserContext";
import DocumentList from "./Components/DocumentList";


export default function DocumentsPage() {
    const userContext = useContext(UserContext);

    const [documentList, setDocumentList] = useState([{ document_id: -1, document_name: "", upload_time: new Date() }]);

    const getList = useCallback(async () => {
        const response = await fetchData(`/api/document/get-documents-list/${userContext.selectedCourse.course_id}`);
        if (response.status === 200) {
            const documents = await response.json();
            const parsed = documents.map((document) => {
                document.upload_time = new Date(document.upload_time);
                return document
            });
            setDocumentList(parsed);
        } else {
            console.log("There was an error while getting the documents list");
            console.log(await response.text());
        }
    }, [userContext.selectedCourse.course_id]);
    useEffect(() => {
        setDocumentList([]);
        getList();
    }, [userContext.selectedCourse.course_id, getList]);

    return (
        <div id="documents-page">
            {userContext.isInstructor ? <DocumentUpload onSucess={() => getList()} /> : ""}
            <DocumentList documentList={documentList} />
        </div>
    )
}

import './Styles/DocumentList.css';
import downloadIconUrl from "../../assets/images/download-icon.svg";
import PropTypes from "prop-types";
import { useContext } from 'react';
import UserContext from '../../Context/UserContext';

export default function DocumentList({ documentList }) {
    const userContext = useContext(UserContext);
    return (
        <>
            <h4 className="page-title">Documents for {userContext.selectedCourse.course_name}</h4>
            <div id="document-list">
                {documentList ? documentList.map((document) => {
                    return <p className="document-row" key={document.document_id}>
                        <span className="document-name">{document.document_name}</span>
                        <span className="document-date">Date: {document.upload_time.toDateString()}</span>
                        <a target="_blank" href={`/api/document/get-document/${userContext.selectedCourse.course_id}/${document.document_id}`}><img src={downloadIconUrl} className="download-icon" alt="download icon" /></a>
                    </p>
                }) :
                    "This course has no documents"}
            </div>
        </>
    )
}

DocumentList.propTypes = {
    document: PropTypes.arrayOf({
        document_id: PropTypes.number.isRequired,
        document_name: PropTypes.string.isRequired,
        upload_time: PropTypes.instanceOf(Date)
    })
}
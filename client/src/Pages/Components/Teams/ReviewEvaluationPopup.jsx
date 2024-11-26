import { useCallback, useEffect, useState } from 'react';
import '../Styles/PopUp.css';
import '../Styles/EvaluationResults.css';
import PropTypes from 'prop-types';
import { fetchData } from '../../../Controller/FetchModule';

const emptyStudentData =
{
    avg_across_all: 0,
    evaluations:
        [
            {
                criteria: "COOPERATION",
                avg: 0,
                count: 0,
                comments: [
                    ""
                ]
            },
            {
                criteria: "CONCEPTUAL CONTRIBUTION",
                avg: 0,
                count: 0,
                comments: [
                    ""
                ]
            },
            {
                criteria: "PRACTICAL CONTRIBUTION",
                avg: 0,
                count: 0,
                comments: [
                    ""
                ]
            },
            {
                criteria: "WORK ETHIC",
                avg: 0,
                count: 0,
                comments: [
                    ""
                ]
            }
        ]
}

function ReviewEvaluationPopup(props) {

    ReviewEvaluationPopup.propTypes = {
        trigger: PropTypes.bool.isRequired,
        setTrigger: PropTypes.func.isRequired,
        team_id: PropTypes.number.isRequired,
        team_name: PropTypes.string.isRequired,
    };

    const [studentData, setStudentData] = useState(emptyStudentData);

    const getResultDetails = useCallback(async () => {
        const response = await fetchData(`/api/evaluation/get-anonymized-feedback/${props.team_id}`);
        console.log("here")
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            if (!data) {
                setStudentData(emptyStudentData);
            } else {
                setStudentData(data);
            }
        }
    }, [props.team_id]);

    useEffect(() => {
        getResultDetails();
    }, [getResultDetails]);

    const handleClose = () => {
        props.setTrigger(false);
    };

    return (props.trigger) ? (
        <div className="popup">
            <div className="eval-popup-inner border-outer">
                <button className="close-x" onClick={handleClose}>×</button>
                <p style={{ fontWeight: 'bold' }}> My Evaluation Summary       </p>
                <div className="table-container">
                    <table className="EvalTableStyle">
                        <thead>
                            <tr>
                                {studentData.evaluations.map((criteria, i) => (
                                    <th key={i}> {criteria.criteria} </th>
                                ))}
                                <th> Avg. across all</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {studentData.evaluations.map((criteria, i) => (
                                    <td key={i}>{Number(criteria.avg).toPrecision(2) == 0.0 ? "N/A" : Number(criteria.avg).toPrecision(2)}</td>
                                ))}
                                <td> {Number(studentData.avg_across_all).toPrecision(2) == 0.0 ? "N/A" : Number(studentData.avg_across_all).toPrecision(2)} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p style={{ fontWeight: 'bold' }}> Comments </p>
                <div className="comment-container">

                    {studentData.evaluations.map((criteria, i) => (
                        <>
                            <p key={`p1${i}`} style={{ margin: '0px', fontWeight: 'bold' }}> {criteria.criteria} </p>
                            {criteria.comments.map((comment, i) => (
                                <>
                                    <p key={i}> {comment}</p>
                                    <hr />
                                </>
                            ))}
                        </>
                    ))}
                </div>

            </div>
        </div >
    ) : "";
}

export default ReviewEvaluationPopup;
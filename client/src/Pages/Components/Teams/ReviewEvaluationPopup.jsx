import { useCallback, useEffect, useState } from 'react';
import '../Styles/PopUp.css';
import '../Styles/EvaluationResults.css';
import PropTypes from 'prop-types';
import { fetchData } from '../../../Controller/FetchModule';

const emptyStudentData =
{
    avg_across_all: 3,
    evaluations:
        [
            {
                criteria: "COOPERATION",
                avg: 5,
                count: 1,
                comments: [
                    "Some rwedeview1"
                ]
            },
            {
                criteria: "CONCEPTUAL CONTRIBUTION",
                avg: 1,
                count: 1,
                comments: [
                    "Some review2"
                ]
            },
            {
                criteria: "PRACTICAL CONTRIBUTION",
                avg: 3,
                count: 1,
                comments: [
                    "Some review3"
                ]
            },
            {
                criteria: "WORK ETHIC",
                avg: 2,
                count: 1,
                comments: [
                    "Some review4"
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
        evaluatee: PropTypes.object.isRequired
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

                <div className="table-container">
                    <table className="EvalTableStyle">
                        <thead>
                            {studentData.map((criteria, i) => (
                                <td key={i}> {criteria.criteria} </td>
                            ))}
                            <td> Avg. across all</td>
                        </thead>
                        <tbody>
                            <tr>
                                {studentData.map((criteria, i) => (
                                    <td key={i}> {criteria.avg == 0 ? "N/A" : criteria.avg} </td>
                                ))}
                                <td> {studentData.avg_across_all == 0 ? "N/A" : studentData.avg_across_all} </td>
                            </tr>
                            <tr>
                                {studentData.map((criteria, i) => (
                                    <td key={i}>
                                        {criteria.comments.map((comment, i) => (
                                            <p key={i}> {comment}</p>
                                        ))}
                                    </td>
                                ))}
                                <td> N/A </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    ) : "";
}

export default ReviewEvaluationPopup;
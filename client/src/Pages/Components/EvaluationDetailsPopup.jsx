import { useCallback, useEffect, useState } from 'react';
import './Styles/PopUp.css';
import './Styles/EvaluationResults.css';
import PropTypes from 'prop-types';
import { fetchData } from '../../Controller/FetchModule';

const emptyStudentData = {
    evaluatee_name: "",
    evaluatee_school_id: "",
    evaluations: [
        {
            evaluator_name: "",
            average_rating: 0,
            ratings: [
                {
                    criteria: "COOPERATION",
                    rating: 0,
                    comment: "",
                },
                {
                    criteria: "CONCEPTUAL CONTRIBUTION",
                    rating: 0,
                    comment: "",
                },
                {
                    criteria: "PRACTICAL CONTRIBUTION",
                    rating: 0,
                    comment: "",
                },
                {
                    criteria: "WORK ETHIC",
                    rating: 0,
                    comment: "",
                },
            ],
            evaluator_school_id: "",
        }
    ],
    count: 0,
}

function EvaluationDetailsPopup(props) {

    EvaluationDetailsPopup.propTypes = {
        trigger: PropTypes.bool.isRequired,
        setTrigger: PropTypes.func.isRequired,
        team_id: PropTypes.number.isRequired,
        team_name: PropTypes.string.isRequired,
        evaluatee: PropTypes.object.isRequired
    };

    const [studentData, setStudentData] = useState(emptyStudentData);

    const getResultDetails = useCallback(async () => {
        const response = await fetchData(`/api/evaluation/get-team-details/${props.team_id}/${props.evaluatee.school_id}`);
        if (response.ok) {
            const data = await response.text();
            if (!data) {
                setStudentData(emptyStudentData);
            } else {
                setStudentData(JSON.parse(data));
            }
        }
    }, [props.team_id, props.evaluatee.school_id]);

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
                <h2 style={{ color: 'black' }}> Results of {props.evaluatee.f_name} {props.evaluatee.l_name} ({props.evaluatee.school_id}) in {props.team_name} </h2>
                {studentData.count == 0 ?
                    <>THIS STUDENT HAS YET TO BE EVALUATED</>
                    :
                    <>
                        <div className="table-container">
                            <table className="EvalTableStyle">
                                <thead>
                                    <tr>
                                        <th> Evaluator </th>
                                        <th> Work Ethic </th>
                                        <th> Cooperation </th>
                                        <th> Conceptual Contribution </th>
                                        <th> Practical Contribution </th>
                                        <th> Average Across All </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData.evaluations.map((evaluator, i) => (
                                        <tr key={i}>
                                            <td> {evaluator.evaluator_name} - {evaluator.evaluator_school_id} </td>
                                            {evaluator.ratings.map((rating, i) => (
                                                <td key={i}> {rating.rating} </td>
                                            ))}
                                            <td>{Number(evaluator.average_rating).toPrecision(2) == 0.0 ? "N/A" : Number(evaluator.average_rating).toPrecision(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="comment-container">
                            <p style={{ fontWeight: 700 }}> Comments </p>
                            {studentData.evaluations.map((evaluator, i) => (
                                <div className="rating-container" key={i}>
                                    <p style={{ fontWeight: 700 }}> {evaluator.evaluator_name} - {evaluator.evaluator_school_id} : </p>
                                    {evaluator.ratings.map((rating, j) => (
                                        rating.comment && <p className='comment' key={j}> {rating.criteria.toLowerCase()}: {rating.comment}</p>
                                    ))}
                                    <hr />
                                </div>
                            ))}
                        </div>
                    </>
                }
            </div>
        </div >
    ) : "";
}

export default EvaluationDetailsPopup;
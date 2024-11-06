import { useCallback, useEffect, useState } from 'react';
import './Styles/PopUp.css';
import './Styles/EvaluationResults.css';
import PropTypes from 'prop-types';
import { fetchData } from '../../Controller/FetchModule';

function EvaluationDetailsPopup(props) {

    EvaluationDetailsPopup.propTypes = {
        trigger: PropTypes.bool.isRequired,
        setTrigger: PropTypes.func.isRequired,
        team_id: PropTypes.number.isRequired,
        team_name: PropTypes.string.isRequired,
        evaluatee: PropTypes.object.isRequired
    };

    const [studentData, setStudentData] = useState([{
        f_name: "test",
        l_name: "testing",
        school_id: 0,
        average_rating: 0,
        comments: "",
        ratings: [
            {
                "given_rating": 0,
                "criteria": "Work Ethic"
            },
            {
                "given_rating": 0,
                "criteria": "Cooperation"
            },
            {
                "given_rating": 0,
                "criteria": "Conceptual Contribution"
            },
            {
                "given_rating": 0,
                "criteria": "Practical Contribution"
            }
        ]
    }]);

    const getResultDetails = useCallback(async () => {
        const response = await fetchData(`/api/evaluation/get-summary/${props.team_id}/${props.evaluatee.school_id}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            // setStudentData(data);
        } else {
            console.log("something went wrong fetching the evaluation results");
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
                <div className="table-container">
                    <table className="EvalTableStyle">
                        <thead>
                            <tr>
                                <th>Evaluator</th>
                                <th> Work Ethic </th>
                                <th> Cooperation </th>
                                <th> Conceptual Contribution </th>
                                <th> Practical Contribution </th>
                                <th>Average Across All</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student, i) => (
                                <tr key={i}>
                                    <td> {student.l_name} {student.f_name} - {student.school_id} </td>
                                    <td> {student.ratings[0]?.given_rating || "N/A"} </td>
                                    <td> {student.ratings[1]?.given_rating || "N/A"} </td>
                                    <td> {student.ratings[2]?.given_rating || "N/A"} </td>
                                    <td> {student.ratings[3]?.given_rating || "N/A"} </td>
                                    <td>{Number(student.average_rating).toPrecision(2) == 0.0 ? "N/A" : Number(student.average_rating).toPrecision(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ) : "";
}

export default EvaluationDetailsPopup;
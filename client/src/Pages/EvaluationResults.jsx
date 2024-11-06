import PropTypes from 'prop-types';
import { IoMdArrowBack } from "react-icons/io";
import "./Components/Styles/EvaluationResults.css";
import { fetchData } from '../Controller/FetchModule';
import { useCallback, useEffect, useState } from 'react';

function EvaluationResults(props) {

    EvaluationResults.propTypes = {
        setShowingResults: PropTypes.func,
        selectedTeam: PropTypes.object
    }

    const [evaluationData, setEvaluationData] = useState([{
        average: 0,
        count: "0",
        school_id: "",
        team_name: "",
        f_name: "john",
        l_name: "doe",
        ratings: [
            {
                "average_rating": 0,
                "criteria": ""
            }
        ]
    }]);

    function returnToTeams() {
        props.setShowingResults(false);
    }

    const getResults = useCallback(async () => {
        const response = await fetchData(`/api/evaluation/get-summary/${props.selectedTeam.team_id}`);
        if (response.ok) {
            const data = await response.json();
            setEvaluationData(data);
        } else {
            console.log("something went wrong fetching the evaluation results");
        }
    }, [props.selectedTeam.team_id]);

    useEffect(() => {
        getResults();
    }, [getResults]);

    return (
        <div className="eval-summary-container">
            <div className="table-title">Evaluation results of {evaluationData[0].team_name}</div>
            <div onClick={returnToTeams} className="eval-close-btn">
                <IoMdArrowBack />
                <p> Go Back to Teams</p>
            </div>
            <div className="table-container">
                <table className="EvalTableStyle">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Lastname</th>
                            <th>FirstName</th>
                            <th>Team</th>
                            <th> Work Ethic </th>
                            <th> Cooperation </th>
                            <th> Conceptual Contribution </th>
                            <th> Practical Contribution </th>
                            <th>Average</th>
                            <th># responses</th>
                            <th>Detailed Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluationData.map((student, i) => (
                            <tr key={i}>
                                <td> {student.school_id} </td>
                                <td> {student.l_name} </td>
                                <td> {student.f_name} </td>
                                <td> {props.selectedTeam.team_name} </td>
                                <td> {student.ratings[0]?.average_rating || "N/A"} </td>
                                <td> {student.ratings[1]?.average_rating || "N/A"} </td>
                                <td> {student.ratings[2]?.average_rating || "N/A"} </td>
                                <td> {student.ratings[3]?.average_rating || "N/A"} </td>
                                <td>{Number(student.average).toPrecision(2) == 0.0 ? "N/A" : Number(student.average).toPrecision(2)}</td>
                                <td> {student.count == 0 ? "N/A" : student.count} </td>
                                <td className="view-result-btn">View</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EvaluationResults;
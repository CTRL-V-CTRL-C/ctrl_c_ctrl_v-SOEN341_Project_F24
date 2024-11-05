import PropTypes from 'prop-types';
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
                "criteria": "WORK ETHIC"
            },
            {
                "average_rating": 0,
                "criteria": "COOPERATION"
            },
            {
                "average_rating": 0,
                "criteria": "CONCEPTUAL CONTRIBUTION"
            },
            {
                "average_rating": 0,
                "criteria": "PRACTICAL CONTRIBUTION"
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
            console.log(data);
            setEvaluationData(data);
        } else {
            console.log("something went wrong fetching the evaluation results");
        }
    }, [props.selectedTeam.team_id]);

    useEffect(() => {
        getResults();
    }, [getResults]);

    return (
        <div>
            <div>Evaluation results of {evaluationData[0].team_name}</div>
            <div onClick={returnToTeams}> Close </div>
            <div>
                <table className="TableStyle">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Lastname</th>
                            <th>FirstName</th>
                            <th>Team</th>
                            {evaluationData[0].ratings.map((rating, i) => (
                                <th key={`th${i}`}> {rating.criteria}</th>
                            ))}
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
                                {student.ratings.map((rating, i) => (
                                    <td key={`crit${i}`}> {rating.average_rating} </td>
                                ))}
                                <td>{Number(student.average).toPrecision(2)}</td>
                                <td> {student.count} </td>
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
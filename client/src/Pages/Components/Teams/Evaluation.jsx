import { useState } from "react";
import "../Styles/MyTeam.css"
import StarRating from "./StarRating";
import PropTypes from 'prop-types';


function Evaluation(props) {
    const [evaluations, setEvaluations] = useState(
        [
            { criteria: "cooperation", rating: 0 },
            { criteria: "conceptual_contribution", rating: 0 },
            { criteria: "practical_contribution", rating: 0 },
            { criteria: "work_ethic", rating: 0 }
        ]
    );

    Evaluation.propTypes = {
        teammate_name: PropTypes.string,
    }

    async function submitEvaluation() {
        console.log("TODO SUBMITTING EVALUATION");
        console.log(evaluations);
    }

    return (
        <div className="teammate-evaluation my-team-info">
            <div className="team-name"> Evaluating: {props.teammate_name} </div>
            <div className="teammates-card">
                {evaluations.map((evaluation, i) =>
                    <div className="criteria-section" key={i}>
                        <p className="criteria-name"> {evaluation.criteria} </p>
                        <StarRating key={i} rating_criteria={i} evaluations={evaluations} setEvaluations={setEvaluations} />
                    </div>
                )}
            </div>
            <button onClick={submitEvaluation} className="evaluation-btn"> SUBMIT </button>
        </div>
    );
}

export default Evaluation;
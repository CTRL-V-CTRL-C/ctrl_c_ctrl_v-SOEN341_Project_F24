import { useState } from "react";
import "../Styles/MyTeam.css"
import StarRating from "./StarRating";
import PropTypes from 'prop-types';


function Evaluation(props) {
    const [evaluations, setEvaluations] = useState(
        [
            { criteria: "Cooperation", rating: 0 },
            { criteria: "Conceptual Contribution", rating: 0 },
            { criteria: "Practical Contribution", rating: 0 },
            { criteria: "Work Ethic", rating: 0 }
        ]
    );

    const [errormsg, setErrormsg] = useState("");

    Evaluation.propTypes = {
        teammate: PropTypes.object,
    }

    async function submitEvaluation() {
        console.log("TODO SUBMITTING EVALUATION");
        setErrormsg("");
        evaluations.map(criteria => {
            if (criteria.rating === 0) {
                setErrormsg("Evaluate all criterias before submitting.");
            }
        })
        console.log(evaluations);
    }

    return (
        <div className="teammate-evaluation my-team-info">
            <div className="team-name"> Evaluating: {props.teammate.f_name} {props.teammate.l_name} </div>
            <div className="teammates-card">
                {evaluations.map((evaluation, i) =>
                    <>
                        <div className="criteria-section" key={i}>
                            <p className="criteria-name"> {evaluation.criteria} </p>
                            <StarRating key={i} teammate={props.teammate} rating_criteria={i} evaluations={evaluations} setEvaluations={setEvaluations} />
                        </div>
                        <textarea maxLength={250} className="comment-box"></textarea>
                    </>
                )}
            </div>
            <button onClick={submitEvaluation} className="evaluation-btn"> SUBMIT </button>
            {errormsg ? <p className="error"> {errormsg} </p> : <></>}
        </div>
    );
}

export default Evaluation;
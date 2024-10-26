import { useEffect, useState } from "react";
import "../Styles/MyTeam.css"
import StarRating from "./StarRating";
import PropTypes from 'prop-types';
import { fetchData } from "../../../Controller/FetchModule";


function Evaluation(props) {
    const [evaluations, setEvaluations] = useState(
        [
            { criteria: "Cooperation", rating: 0, comment: "" },
            { criteria: "Conceptual Contribution", rating: 0, comment: "" },
            { criteria: "Practical Contribution", rating: 0, comment: "" },
            { criteria: "Work Ethic", rating: 0, comment: "" }
        ]
    );

    const [errormsg, setErrormsg] = useState("");

    Evaluation.propTypes = {
        teammate: PropTypes.object,
        team_id: PropTypes.number
    }

    useEffect(() => {
        (async () => {
            const fetchEvaluations = async () => {
                const response = await fetchData(`/api/evaluation/get-my-evaluation/${props.team_id}/${props.teammate.user_id}`);
                if (response.status === 200) {
                    console.log("GOOD")
                    const data = await response.json();
                    setEvaluations(data);
                } else {
                    console.log("Error Occured when fetching the evaluations");
                }
            }

            await fetchEvaluations();
        })();
    }, [props.team_id, props.teammate.user_id])

    async function submitEvaluation() {
        setErrormsg("");
        evaluations.map(criteria => {
            if (criteria.rating === 0) {
                setErrormsg("Evaluate all criterias before submitting.");
            }
        })

        let submissionEval = {
            evaluations: [...evaluations],
            user_id: props.teammate.user_id,
            team_id: props.teammate.team_id
        }
        if (errormsg === "") {
            console.log("SUBMITTING")
            console.log(submissionEval);
        }
    }

    const handleCommentChange = (e, i) => {
        const updatedEvaluations = [...evaluations];
        updatedEvaluations[i] = {
            ...updatedEvaluations[i],
            comment: e.target.value
        };

        setEvaluations(updatedEvaluations);
    };

    return (
        <div className="teammate-evaluation my-team-info">
            <div className="team-name"> Evaluating: {props.teammate.f_name} {props.teammate.l_name} </div>
            <div className="teammates-card">
                {evaluations.map((evaluation, i) =>
                    <div key={i}>
                        <div className="criteria-section" key={`criteria_${i}`}>
                            <p className="criteria-name"> {evaluation.criteria} </p>
                            <StarRating key={`rating_${i}`} teammate={props.teammate} rating_criteria={i} evaluations={evaluations} setEvaluations={setEvaluations} />
                        </div>
                        <textarea key={`comment_${i}`} maxLength={250} value={evaluations[i].comment} onChange={(e) => handleCommentChange(e, i)} className="comment-box"></textarea>
                    </div>
                )}
            </div>
            <div onClick={submitEvaluation} className="container">
                <a className="button type--C">
                    <div className="button__line"></div>
                    <div className="button__line"></div>
                    <span className="button__text">SUBMIT</span>
                </a>
            </div>
            {errormsg ? <p className="error"> {errormsg} </p> : <></>}
        </div>
    );
}

export default Evaluation;
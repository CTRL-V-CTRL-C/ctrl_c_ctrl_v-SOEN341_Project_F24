import { useEffect, useState } from "react";
import "../Styles/MyTeam.css";
import StarRating from "./StarRating";
import PropTypes from 'prop-types';
import { fetchData, postData } from "../../../Controller/FetchModule";
import ConfirmEvaluation from "./ConfirmEvaluation";

function Evaluation(props) {
    const [evaluations, setEvaluations] = useState([
        { criteria: "COOPERATION", description: "", rating: 0, comment: "" },
        { criteria: "CONCEPTUAL CONTRIBUTION", rating: 0, comment: "" },
        { criteria: "PRACTICAL CONTRIBUTION", rating: 0, comment: "" },
        { criteria: "WORK ETHIC", rating: 0, comment: "" }
    ]);
    const [errormsg, setErrormsg] = useState("");
    const criteriaDescriptions = {
        "COOPERATION": "Did they show cooperation through active listening, constructive feedback, and willingness to support team tasks?",
        "CONCEPTUAL CONTRIBUTION": "Did they contribute valuable ideas or insights that enhanced the project’s vision and direction?",
        "PRACTICAL CONTRIBUTION": "Did they take concrete actions and show skill in completing their assigned tasks efficiently and effectively?",
        "WORK ETHIC": "Did they demonstrate reliability, dedication, and a strong commitment to completing their work on time?"
    }

    Evaluation.propTypes = {
        teammate: PropTypes.object,
        team_id: PropTypes.number,
        showConfirmation: PropTypes.bool,
        setShowConfirmation: PropTypes.func
    };

    useEffect(() => {
        (async () => {
            const fetchEvaluations = async () => {
                const response = await fetchData(`/api/evaluation/get-my-evaluation/${props.team_id}/${props.teammate.user_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvaluations(data);
                } else {
                    setErrormsg("Error occurred when fetching the evaluations");
                }
            };
            await fetchEvaluations();
        })();
    }, [props.team_id, props.teammate.user_id]);

    const submitEvaluation = () => {
        setErrormsg("");
        const incomplete = evaluations.some((criteria) => criteria.rating === 0);

        if (incomplete) {
            setErrormsg("Evaluate all criteria before submitting.");
        } else {
            props.setShowConfirmation(true);
        }
    };

    const confirmEvaluation = async () => {
        props.setShowConfirmation(false);
        const submissionEval = {
            evaluation_details: [...evaluations],
            user_id: props.teammate.user_id,
            team_id: props.team_id
        };
        const response = await postData("/api/evaluation/evaluate", submissionEval);
        if (!response.ok) {
            setErrormsg("An error occurred when submitting the Evaluation");
        }
    };

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
            {props.showConfirmation ?
                <ConfirmEvaluation
                    evaluations={evaluations}
                    onConfirm={confirmEvaluation}
                    onCancel={() => props.setShowConfirmation(false)}
                />
                :
                <>
                    <div className="team-name">Evaluating: {props.teammate.f_name} {props.teammate.l_name}</div>
                    <div className="teammates-card">
                        {evaluations.map((evaluation, i) => (
                            <div key={i}>
                                <div className="criteria-section" key={`criteria_${i}`}>
                                    <p className="criteria-name"> {evaluation.criteria} </p>
                                    <StarRating
                                        key={`rating_${i}`}
                                        teammate={props.teammate}
                                        rating_criteria={i}
                                        evaluations={evaluations}
                                        setEvaluations={setEvaluations}
                                    />
                                </div>
                                <p className="evaluation-description"> {criteriaDescriptions[evaluation.criteria] || "Description not available"} </p>
                                <textarea
                                    key={`comment_${i}`}
                                    maxLength={250}
                                    value={evaluations[i].comment}
                                    onChange={(e) => handleCommentChange(e, i)}
                                    className="comment-box"
                                ></textarea>
                            </div>
                        ))}
                    </div>
                    <div onClick={submitEvaluation} className="container">
                        <a className="button type--C">
                            <div className="button__line"></div>
                            <div className="button__line"></div>
                            <span className="button__text">SUBMIT</span>
                        </a>
                    </div>
                    {errormsg && <p className="error"> {errormsg} </p>}
                </>
            }
        </div>
    );
}

export default Evaluation;
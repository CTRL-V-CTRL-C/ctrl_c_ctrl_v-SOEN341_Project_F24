import { useContext, useEffect, useState } from "react";
import "../Styles/MyTeam.css";
import PropTypes from 'prop-types';
import UserContext from "../../../Context/UserContext";
import { MdOutlineRateReview, MdEmail } from "react-icons/md";
import Evaluation from "./Evaluation";
import { fetchData } from "../../../Controller/FetchModule";
import ReviewEvaluationPopup from "./ReviewEValuationPopup";

function MyTeam(props) {

    MyTeam.propTypes = {
        getReleaseState: PropTypes.func.isRequired,
        reviewsReleased: PropTypes.bool.isRequired
    };

    const userContext = useContext(UserContext);
    const [team, setTeam] = useState({
        team_id: 0,
        team_name: "",
        members: [{ email: "", f_name: "", l_name: "", team_id: 0, user_id: 0 }]
    });
    const [openDetailPopup, setOpenDetailPopup] = useState(false);
    const [evaluatingMember, setEvaluatingMember] = useState({});
    const [courseName, setCourseName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        setCourseName(userContext.selectedCourse.course_name);
        props.getReleaseState();
        const fetchTeams = async () => {
            let response = await fetchData(`/api/team/get-my-team/${userContext.selectedCourse.course_id}`);
            if (response.status === 200) {
                let data = await response.json();
                setTeam(data);
            } else {
                console.log("There was an error while trying to get the teams");
                console.log(await response.text());
            }
        }
        if (!userContext.selectedCourse || userContext.selectedCourse.course_id === 0) return;
        fetchTeams();
    }, [userContext.selectedCourse, props]);

    function reviewTeammate(i) {
        if (!showConfirmation) {
            setEvaluatingMember(team.members[i]);
        }
    }

    return (
        team.team_id == 0 ?
            <></>
            :
            <>
                <p className="course-title"> {courseName} </p>
                {
                    !userContext.isInstructor ?
                        <>
                            <button
                                type="button"
                                id="release-reviews"
                                className="release-reviews-btn"
                                disabled={!props.reviewsReleased}
                                onClick={() => setOpenDetailPopup(true)}
                            > View my Reviews </button>
                            <ReviewEvaluationPopup
                                trigger={openDetailPopup}
                                setTrigger={setOpenDetailPopup}
                                class
                                team_id={team.team_id}
                                team_name={team.team_name}
                            />
                        </>
                        :
                        <></>
                }
                <div className="my-team">
                    <div className="my-team-info">
                        <div className="team-name"> {team.team_name} </div>
                        <div className="teammates-card">
                            {team.members.map((member, i) =>
                                <div className="teammate-card" key={i}>
                                    <div className="teammate-info">
                                        <p className="teammate-details"> {member.f_name} {member.l_name}</p>
                                        <p className="teammate-details"> <MdEmail className="email-icon" />{member.email} </p>
                                    </div>
                                    {userContext.userID == member.user_id ?
                                        <></>
                                        :
                                        <div className="review-btn" onClick={() => reviewTeammate(i)}> <MdOutlineRateReview className="review-icon" /> Review </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    {Object.keys(evaluatingMember).length !== 0 ? <Evaluation showConfirmation={showConfirmation} setShowConfirmation={setShowConfirmation} team_id={team.team_id} teammate={evaluatingMember} /> : <></>}
                </div>
            </>
    )
}

export default MyTeam;
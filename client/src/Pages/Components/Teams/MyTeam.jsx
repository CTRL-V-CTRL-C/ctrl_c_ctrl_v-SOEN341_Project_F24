import { useContext, useEffect, useState } from "react";
import "../Styles/MyTeam.css";
import UserContext from "../../../Context/UserContext";
import { MdOutlineRateReview, MdEmail } from "react-icons/md";
import Evaluation from "./Evaluation";
import { fetchData } from "../../../Controller/FetchModule";

function MyTeam() {
    const userContext = useContext(UserContext);
    const [team, setTeam] = useState({
        team_id: 0,
        team_name: "",
        membres: [{ email: "", f_name: "", l_name: "", team_id: 0, user_id: 0 }]
    });
    const [evaluatingMember, setEvaluatingMember] = useState({});
    const [courseName, setCourseName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const fetchTeams = async () => {
            let response = await fetchData(`/api/team/get-my-team/${userContext.selectedCourse.course_id}`);
            let data = await response.json();
            setTeam(data);
        }
        if (!userContext.selectedCourse || userContext.selectedCourse.course_id === 0) return;
        fetchTeams();
    }, [userContext.selectedCourse]);

    useEffect(() => {
        setCourseName(userContext.selectedCourse.course_name);
    }, [userContext.selectedCourse]);

    function reviewTeammate(i) {
        if (!showConfirmation) {
            setEvaluatingMember(team.members[i]);
        }
    }

    return (
        <>
            <p className="course-title"> COURSE: {courseName} </p>
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
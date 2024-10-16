import { useEffect, useState } from "react";
import "../Styles/MyTeam.css";
import { MdOutlineRateReview, MdEmail } from "react-icons/md";
import Evaluation from "./Evaluation";

function MyTeam() {

    const [teamInfo, setTeamInfo] = useState({ email: "", f_name: "", l_name: "", members: [] });
    const [evaluatingMember, setEvaluatingMember] = useState({});

    useEffect(() => {
        setTeamInfo({
            team_name: "Team 1",
            members:
                [
                    { email: "bob.bobson@gmail.com", f_name: "Bob", l_name: "Bobson", team_id: 1, user_id: 27 },
                    { email: "john.johnson@gmail.com", f_name: "John", l_name: "Johnson", team_id: 1, user_id: 56 },
                    { email: "richard.richardson@gmail.com", f_name: "Richard", l_name: "Richardson", team_id: 1, user_id: 2 },
                ]
        });
    }, [])

    function reviewTeammate(i) {
        setEvaluatingMember(teamInfo.members[i])
    }

    return (
        <div className="my-team">
            <div className="my-team-info">
                <div className="team-name"> {teamInfo.team_name} </div>
                <div className="teammates-card">
                    {teamInfo.members.map((member, i) =>
                        <div className="teammate-card" key={i}>
                            <div className="teammate-info">
                                <p className="teammate-details"> {member.f_name} {member.l_name}</p>
                                <p className="teammate-details"> <MdEmail className="email-icon" />{member.email} </p>
                            </div>
                            <div className="review-btn" onClick={() => reviewTeammate(i)}> <MdOutlineRateReview className="review-icon" /> Review </div>
                        </div>
                    )}
                </div>
            </div>
            {Object.keys(evaluatingMember).length !== 0 ? <Evaluation teammate={evaluatingMember} /> : <></>}
        </div>

    )
}

export default MyTeam;
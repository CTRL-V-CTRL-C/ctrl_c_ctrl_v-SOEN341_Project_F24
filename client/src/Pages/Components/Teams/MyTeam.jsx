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
                    { email: "bob.bobson@gmail.com", f_name: "Bob", l_name: "Bobson" },
                    { email: "john.johnson@gmail.com", f_name: "John", l_name: "Johnson" },
                    { email: "richard.richardson@gmail.com", f_name: "Richard", l_name: "Richardson" },
                ]
        });
    }, [])

    function reviewTeammate(e) {
        console.log("REVIEWING TEAMMATE");
        console.log(e);
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
                            <div className="review-btn" onClick={(e) => reviewTeammate(e)}> <MdOutlineRateReview className="review-icon" /> Review </div>
                        </div>
                    )}
                </div>
            </div>
            <Evaluation />
        </div>

    )
}

export default MyTeam;
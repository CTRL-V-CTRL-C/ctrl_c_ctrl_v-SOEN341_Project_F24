import { useEffect, useState } from "react";
import "../Styles/MyTeam.css";

function MyTeam() {

    const [teamInfo, setTeamInfo] = useState({ email: "", f_name: "", l_name: "", members: [] });

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
            <div> {teamInfo.team_name} </div>
            <div className="teammates">
                {teamInfo.members.map((member, i) =>
                    <div className="teammate-card" key={i}>
                        <div className="teammate-info">
                            <p> {member.f_name} {member.l_name}</p>
                            <p>{member.email} </p>
                        </div>
                        <button onClick={(e) => reviewTeammate(e)}> Review </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTeam;
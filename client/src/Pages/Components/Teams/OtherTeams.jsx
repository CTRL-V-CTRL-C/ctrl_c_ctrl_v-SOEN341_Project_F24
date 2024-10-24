import { useContext, useEffect, useState } from "react";
import UserContext from "../../../Context/UserContext";
import { fetchData } from "../../../Controller/FetchModule";

const emptyTeam = { team_name: "", members: [{ f_name: "", l_name: "", email: "" }] }

function OtherTeams() {
    const userContext = useContext(UserContext);
    const [teams, setTeams] = useState([emptyTeam]);
    const [courseName, setCourseName] = useState("");

    useEffect(() => {
        const fetchTeams = async () => {
            let response = await fetchData(`/api/team/get-teams/${userContext.selectedCourse.course_id}`);
            let data;
            if (response.ok) {
                data = await response.json();
            } else {
                data = [emptyTeam];
            }
            setTeams(data);
            if (userContext.selectedCourse.course_id === 0) return;
            setCourseName(userContext.selectedCourse.course_name);
        }
        fetchTeams();
    }, [userContext.selectedCourse]);

    return (
        <>
            <p className="course-title"> COURSE: {courseName} </p>
            <div className="my-team">
                {teams.map((team, i) =>
                    <div key={i} className="my-team-info">
                        <div className="team-name"> {team.team_name} </div>
                        <div className="teammates-card">
                            {team.members.map((member, i) =>
                                <div className="teammate-card" key={i}>
                                    <div className="teammate-info">
                                        <p className="teammate-details"> {member.f_name} {member.l_name} {userContext.isInstructor ? member.email : ""} {userContext.isInstructor ? member.school_id : ""}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default OtherTeams;
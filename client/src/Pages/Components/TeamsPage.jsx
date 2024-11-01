import "./Styles/TeamsPage.css";
import UserContext from "../../Context/UserContext";
import { useContext, useEffect, useState } from "react";
import MembersPage from "./Teams/MembersPage";
import MyTeam from "./Teams/MyTeam";
import OtherTeams from "./Teams/OtherTeams";
import { useNavigate } from "react-router-dom";

function TeamsPage() {

    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [teamsView, setTeamsView] = useState(true);

    useEffect(() => {
        navigate(userContext.userLoggedIn ? "/teams" : "/loginAccount");
    }, [userContext.userLoggedIn, navigate]);

    return (
        <div className="teams-page">
            <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                <input
                    type="checkbox"
                    id="filter"
                    checked={!teamsView}
                    onChange={() => setTeamsView(!teamsView)}
                />
                <span>{userContext.isInstructor ? 'Teams' : 'My Team'}</span>
                <span>{userContext.isInstructor ? 'Members' : 'Other Teams'}</span>
            </label>
            {userContext.hasCourses ?
                (teamsView ?
                    (userContext.isInstructor ? <OtherTeams /> : <MyTeam />) :
                    (userContext.isInstructor ? <MembersPage /> : <OtherTeams />)) :
                <span>You are not part of any courses</span>
            }
        </div>
    );
}

export default TeamsPage;
import "./Styles/TeamsPage.css";
import UserContext from "../../Context/UserContext";
import { useContext, useState } from "react";
import MembersPage from "./Teams/MembersPage";
import MyTeam from "./Teams/MyTeam";
import OtherTeams from "./Teams/OtherTeams";

function TeamsPage() {

    const userContext = useContext(UserContext);
    const [teamsView, setTeamsView] = useState(true);

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
            {teamsView ?
                (userContext.isInstructor ? <OtherTeams /> : <MyTeam />) :
                (userContext.isInstructor ? <MembersPage /> : <OtherTeams />)
            }
        </div>
    );
}

export default TeamsPage;
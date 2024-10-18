import "./Styles/TeamsPage.css";
import UserContext from "../../Context/UserContext";
import { useContext, useState } from "react";
import AllTeams from "./Teams/AllTeams";
import MembersPage from "./Teams/MembersPage";
import MyTeam from "./Teams/MyTeam";
import OtherTeams from "./Teams/OtherTeams";

function TeamsPage() {

    const userContext = useContext(UserContext);
    const [teamsView, setTeamsView] = useState(true);

    return (
        <div className="teams-page">
            {userContext.isInstructor ?
                <>

                    <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                        <input type="checkbox" id="filter" checked={!teamsView} onChange={() => setTeamsView(!teamsView)} />
                        <span>Teams</span>
                        <span>Members</span>
                    </label>
                    {teamsView ?
                        <AllTeams />
                        :
                        <MembersPage />
                    }
                </>
                :
                <>
                    <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                        <input type="checkbox" id="filter" checked={!teamsView} onChange={() => setTeamsView(!teamsView)} />
                        <span>My Team</span>
                        <span>Other Teams</span>
                    </label>
                    {teamsView ?
                        <MyTeam />
                        :
                        <OtherTeams />
                    }
                </>}
        </div >
    );
}

export default TeamsPage;
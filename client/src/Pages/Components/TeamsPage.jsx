import "./Styles/TeamsPage.css";
import AuthContext from "../../Context/AuthContext";
import { useContext, useState } from "react";
import AllTeams from "./AllTeams";
import MembersPage from "./MembersPage";
import MyTeam from "./MyTeam";
import OtherTeams from "./OtherTeams";

function TeamsPage() {

    const auth = useContext(AuthContext);
    const [teamsView, setTeamsView] = useState(true);

    return (
        <div className="teams-page">
            {auth.isInstructor ?
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
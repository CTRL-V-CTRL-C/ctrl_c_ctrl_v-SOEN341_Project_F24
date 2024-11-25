import "./Styles/TeamsPage.css";
import UserContext from "../../Context/UserContext";
import { useContext, useState } from "react";
import MembersPage from "./Teams/MembersPage";
import MyTeam from "./Teams/MyTeam";
import OtherTeams from "./Teams/OtherTeams";

function TeamsPage() {

    const userContext = useContext(UserContext);
    const [teamsView, setTeamsView] = useState(true);

    const releaseReviews = async () => {

    }

    return (
        <div className="teams-page">
            <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                <input
                    type="checkbox"
                    id="filter"
                    checked={!teamsView}
                    onChange={() => setTeamsView(!teamsView)}
                />
                <span id="firstView">{userContext.isInstructor ? 'Teams' : 'My Team'}</span>
                <span id="secondView">{userContext.isInstructor ? 'Members' : 'Other Teams'}</span>
            </label>
            {
                userContext.isInstructor ?
                    <button
                        type="button"
                        id="release-reviews"
                        className="release-reviews-btn"
                        onClick={() => releaseReviews()}
                    > Release Reviews </button>
                    :
                    <></>
            }

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
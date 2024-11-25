import "./Styles/TeamsPage.css";
import UserContext from "../../Context/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import MembersPage from "./Teams/MembersPage";
import MyTeam from "./Teams/MyTeam";
import OtherTeams from "./Teams/OtherTeams";
import { fetchData, postData } from "../../Controller/FetchModule";

function TeamsPage() {

    const userContext = useContext(UserContext);
    const [teamsView, setTeamsView] = useState(true);
    const [reviewsReleased, setReviewsReleased] = useState(false);

    const getReleaseState = useCallback(async () => {
        const response = await fetchData(`/api/course/are-evaluations-released/${userContext.selectedCourse.course_id}`);
        if (response.ok) {
            const data = await response.json()
            setReviewsReleased(data.released)
            console.log(data.released)
        }
    }, [userContext.selectedCourse.course_id]);

    const releaseReviews = async () => {
        if (!reviewsReleased) {
            await postData(`/api/course/release-evaluations/${userContext.selectedCourse.course_id}`, {});
        }
        await getReleaseState();
    }

    useEffect(() => {
        getReleaseState()
    }, [getReleaseState]);

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
                        disabled={reviewsReleased}
                        onClick={async () => await releaseReviews()}
                    > Release Reviews </button>
                    :
                    <></>
            }

            {userContext.hasCourses ?
                (teamsView ?
                    (userContext.isInstructor ? <OtherTeams /> : <MyTeam reviewsReleased={reviewsReleased} getReleaseState={getReleaseState} />) :
                    (userContext.isInstructor ? <MembersPage /> : <OtherTeams />)) :
                <span>You are not part of any courses</span>
            }
        </div>
    );
}

export default TeamsPage;
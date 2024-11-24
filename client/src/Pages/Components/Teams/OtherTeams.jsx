import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../../../Context/UserContext";
import { fetchData } from "../../../Controller/FetchModule";
import SuccessPopup from '../SuccessPopup';
import CSVUploadModal from '../CSVUploadModal'
import EvaluationResults from "../../EvaluationResults";

const emptyTeam = { team_name: "", members: [{ f_name: "", l_name: "", email: "" }] }

function OtherTeams() {
    const userContext = useContext(UserContext);
    const [teams, setTeams] = useState([emptyTeam]);
    const [courseName, setCourseName] = useState("");

    const [openUploadPopup, setButtonPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successPopupWarning, setSuccessPopupWarning] = useState("");

    const [showingResults, setShowingResults] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(emptyTeam);

    const triggerSuccessPopup = (warning) => {
        setSuccessPopupWarning(warning);
        setShowSuccessPopup(true);
    };

    const fetchTeams = useCallback(async () => {
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
    }, [userContext.selectedCourse])

    useEffect(() => {
        fetchTeams(); // Fetch teams on component mount or when selectedCourse changes
        setShowingResults(false);
    }, [userContext.selectedCourse, fetchTeams]);

    function viewResults(team) {
        setSelectedTeam(team);
        setShowingResults(true);
    }

    return (
        <>
            {showingResults ?
                <EvaluationResults selectedTeam={selectedTeam} setShowingResults={setShowingResults} />
                : <>
                    {userContext.isInstructor && (
                        <>
                            <button onClick={() => setButtonPopup(true)}>Upload</button>
                            {/* CSV Upload Popup */}
                            <CSVUploadModal
                                trigger={openUploadPopup}
                                setTrigger={setButtonPopup}
                                class
                                triggerSuccessPopup={triggerSuccessPopup}
                                setSuccessPopupWarning={setSuccessPopupWarning}
                                fetchTeams={fetchTeams} // Pass triggerFetchTeams to PopUp
                            />
                            {/* Success popup */}
                            <SuccessPopup
                                trigger={showSuccessPopup}
                                onClose={() => setShowSuccessPopup(false)}
                                warning={successPopupWarning} // Pass the warning message to SuccessPopup
                            />
                        </>
                    )}
                    <p className="course-title"> {courseName} </p>
                    <div className="my-team">
                        {teams.map((team, i) =>
                            <div key={i} className="my-team-info">
                                <div className="team-name"> {team.team_name} </div>
                                <div className="teammates-card">
                                    <div className="teammate-card bold" key={i}>
                                        <p className="teammate-details"> Full Name</p>
                                        {userContext.isInstructor ?
                                            <>
                                                <p className="teammate-details"> Email</p>
                                                <p className="teammate-details"> School ID</p>
                                            </>
                                            :
                                            <></>
                                        }
                                    </div>
                                    {team.members.map((member, i) =>
                                        <div className="teammate-card" key={i}>
                                            <p className="teammate-details"> {member.f_name} {member.l_name}</p>
                                            {userContext.isInstructor ?
                                                <>
                                                    <p className="teammate-details"> {member.email} </p>
                                                    <p className="teammate-details"> {member.school_id}</p>
                                                </>
                                                :
                                                <></>
                                            }
                                        </div>
                                    )}
                                    {userContext.isInstructor ?
                                        <div onClick={() => viewResults(team)} className="view-results-btn">
                                            View Results
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        )}
                    </div >
                </>
            }
        </>
    )
}

export default OtherTeams;
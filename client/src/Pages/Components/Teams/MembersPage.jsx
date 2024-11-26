// MembersPage.js

import { useCallback, useContext, useEffect, useState } from 'react';
import UserContext from "../../../Context/UserContext";
import '../Styles/MembersPage.css';

function MembersPage() {
    const { selectedCourse } = useContext(UserContext); // Access selectedCourse and courses from context
    const [students, setStudents] = useState([]); // State to hold student data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to hold error messages

    const fetchStudents = useCallback(async () => {
        if (!selectedCourse || selectedCourse.course_id === 0) return; // Ensure selectedCourse is valid
        setLoading(true);
        try {
            const response = await fetch(`/api/course/get-students/${selectedCourse.course_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const studentData = await response.json();
            setStudents(studentData); // Set the fetched students
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }, [selectedCourse]);

    useEffect(() => {
        fetchStudents(); // Fetch students when selectedCourse changes
    }, [selectedCourse, fetchStudents]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div id="whole">
            <div id="TitlePosition"><p id="PageTitle">Student List for {selectedCourse.course_name}</p></div>
            <div>
                <table className="TableStyle">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Id</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{`${student.f_name} ${student.l_name}`}</td>
                                <td>{student.school_id}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MembersPage;
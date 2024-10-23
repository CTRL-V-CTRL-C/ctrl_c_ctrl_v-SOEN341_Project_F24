import React, { useEffect, useState } from 'react';
import '../Styles/MembersPage.css';

function MembersPage() {
    const [students, setStudents] = useState([]); // State to hold student data
    const [courseId, setCourseId] = useState(null); // State to hold course ID
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to hold error messages

    // Function to fetch courses and set the course ID
    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/course/get-courses');
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const courses = await response.json();
            if (courses.length > 0) {
                setCourseId(courses[0].course_id); // Assuming you want the first course
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to fetch students based on course ID
    const fetchStudents = async () => {
        if (!courseId) return; // Ensure courseId is available before fetching students
        try {
            const response = await fetch(`/api/course/get-students/${courseId}`);
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
    };

    // Fetch courses when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch students when the course ID is set
    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    // Display loading or error message
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div id="whole">
            <div id="TitlePosition"><p id="PageTitle">Student List</p></div>
            <div>
                <table id="TableStyle">
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

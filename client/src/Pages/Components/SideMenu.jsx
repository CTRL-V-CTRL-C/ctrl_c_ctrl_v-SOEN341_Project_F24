import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/UserContext";
import { IoMdAdd, IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import "./Styles/SideMenu.css";
import PropTypes from 'prop-types';
import { postData } from "../../Controller/FetchModule";

function SideMenu({ courses, fetchCourses }) {
    SideMenu.propTypes = {
        courses: PropTypes.array,
        fetchCourses: PropTypes.func
    }

    const courseNamePattern = /^[A-Z]{4,4} ?\d{3,3}$/;
    const userContext = useContext(UserContext);
    const [styleClass, setStyleClass] = useState("");
    const [userCourses, setUserCourses] = useState([{ course_name: "", course_id: 0 }]);
    const [addingCourse, setAddingCourse] = useState(false);
    const [error, setError] = useState("");
    const [courseName, setCourseName] = useState("");

    useEffect(() => {
        setUserCourses(courses);
    }, [courses])

    useEffect(() => {
        userContext.userLoggedIn ? setStyleClass("sidebar-on") : setStyleClass("");
    }, [userContext.userLoggedIn]);

    function addCourse() {
        setAddingCourse(true);
    }

    async function confirmCourse() {
        setError("");
        let course = courseName.toUpperCase().normalize("NFKC");
        if (!courseNamePattern.test(course)) {
            setError("Invalid Course Number");
        } else {
            const response = await postData("/api/course/create", { courseName: course })
            if (response.ok) {
                await fetchCourses();
                setAddingCourse(false);
            } else {
                setError("Something went wrong");
            }
        }
    }

    function cancelCourse() {
        setAddingCourse(false);
        setError("");
    }

    function selectCourse(course) {
        userContext.setSelectedCourse(course);
    }

    return (
        userContext.userLoggedIn ?
            <nav className={`menu ${styleClass}`} tabIndex="0">
                <header className="avatar">
                    <h2>Welcome</h2>
                </header>
                <ul>
                    {userCourses.map((course, i) => <li onClick={() => selectCourse(course)} key={i} tabIndex="0" className={userContext.selectedCourse.course_id == course.course_id ? "selected course-menu-elem" : "course-menu-elem"} > <span>{course.course_name}</span></li>)}
                    {userContext.isInstructor ?
                        addingCourse ?
                            <>
                                <div className="input-wrapper">
                                    <IoMdCloseCircleOutline onClick={cancelCourse} className="icon" size={20} />
                                    <input onChange={(e) => { setError(""); setCourseName(e.target.value) }} maxLength={7} type="text" name="text" className="course-input" placeholder="ABCD123" />
                                    <button onClick={confirmCourse} className="Subscribe-btn">
                                        <IoMdAddCircleOutline className="icon" size={20} />
                                        Confirm
                                    </button>
                                </div>
                                <p className="error">{error}</p>
                            </>
                            :
                            <li className="add-course-btn" onClick={async () => await addCourse()} ><IoMdAdd /> Add Course </li>
                        :
                        <></>}
                </ul>
            </nav >
            :
            <></>
    );
}

export default SideMenu;
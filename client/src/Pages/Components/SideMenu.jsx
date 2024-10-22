import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/UserContext";
import { IoMdAdd } from "react-icons/io";
import "./Styles/SideMenu.css";
import { fetchData } from "../../Controller/FetchModule";

function SideMenu() {

    const userContext = useContext(UserContext);
    const [styleClass, setStyleClass] = useState("");
    const [userCourses, setUserCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesResponse = await fetchData("/api/course/get-courses");
            const courses = await coursesResponse.json();
            setUserCourses(courses);
        }
        if (userContext.userLoggedIn) {
            fetchCourses();
        }
    }, [userContext.userLoggedIn]);

    useEffect(() => {
        userContext.userLoggedIn ? setStyleClass("sidebar-on") : setStyleClass("");
    }, [userContext.userLoggedIn]);

    async function addCourse() {
        // TODO display pop up to add course here
        setUserCourses(["Course A", "Course B", "Course C", "COURSE EXTRA"]);
    }

    function selectCourse(course) {
        userContext.setSelectedCourse(course);
    }

    return (
        userContext.userLoggedIn ?
            <nav className={`menu ${styleClass}`} tabIndex="0">
                <div className="smartphone-menu-trigger"></div>
                <header className="avatar">
                    <h2>Welcome</h2>
                </header>
                <ul>
                    {userCourses.map((course, i) => <li onClick={() => selectCourse(course)} key={i} tabIndex="0" className="icon-dashboard" > <span>{course.course_name}</span></li>)}
                    {userContext.isInstructor ?
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
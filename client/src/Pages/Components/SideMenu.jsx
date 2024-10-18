import { useContext, useEffect, useState } from "react";
import UserContext from "../../Context/UserContext";
import { IoMdAdd } from "react-icons/io";
import "./Styles/SideMenu.css";
import { fetchData } from "../../Controller/FetchModule";

function SideMenu() {

    const auth = useContext(UserContext);
    const [styleClass, setStyleClass] = useState("");
    const [userCourses, setUserCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesResponse = await fetchData("/api/course/get-courses");
            const courses = await coursesResponse.json();
            setUserCourses(courses);
        }
        if (auth.userLoggedIn) {
            fetchCourses();
        }
    }, [auth.userLoggedIn]);

    useEffect(() => {
        auth.userLoggedIn ? setStyleClass("sidebar-on") : setStyleClass("");
    }, [auth.userLoggedIn]);

    async function addCourse() {
        console.log("TODO display pop up to add course here");
        setUserCourses(["Course A", "Course B", "Course C", "COURSE EXTRA"]);
    }

    function selectCourse(course) {
        auth.setSelectedCourse(course);
    }

    return (
        auth.userLoggedIn ?
            <nav className={`menu ${styleClass}`} tabIndex="0">
                <div className="smartphone-menu-trigger"></div>
                <header className="avatar">
                    <h2>Welcome</h2>
                </header>
                <ul>
                    {userCourses.map((course, i) => <li onClick={() => selectCourse(course)} key={i} tabIndex="0" className="icon-dashboard" > <span>{course.course_name}</span></li>)}
                    {auth.isInstructor ?
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
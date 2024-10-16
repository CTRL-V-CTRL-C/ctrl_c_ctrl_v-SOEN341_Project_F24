import { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/AuthContext";
import { IoMdAdd } from "react-icons/io";
import "./Styles/SideMenu.css";
import { fetchData } from "../../Controller/FetchModule";

function SideMenu() {

    const auth = useContext(AuthContext);
    const [styleClass, setStyleClass] = useState("");
    const [userCourses, setUserCourses] = useState(["Course A", "Course B", "Course C"]);

    useEffect(() => {
        console.log("HERE")
        const fetchCourses = async () => {
            const coursesResponse = await fetchData("/api/course/get-courses");
            const courses = await coursesResponse.json();
            setUserCourses(courses);
        }
        fetchCourses();
    }, []);

    useEffect(() => {
        auth.userLoggedIn ? setStyleClass("sidebar-on") : setStyleClass("");
    }, [auth.userLoggedIn])

    async function addCourse() {
        console.log("TODO display pop up to add course here");
        setUserCourses(["Course A", "Course B", "Course C", "COURSE EXTRA"])
    }

    return (
        auth.userLoggedIn ?
            <nav className={`menu ${styleClass}`} tabIndex="0">
                <div className="smartphone-menu-trigger"></div>
                <header className="avatar">
                    <h2>Welcome</h2>
                </header>
                <ul>
                    {userCourses.map((course, i) => <li key={i} tabIndex="0" className="icon-dashboard" > <span>{course}</span></li>)}
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
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/AuthContext";
import "./Styles/SideMenu.css";

function SideMenu() {

    const auth = useContext(AuthContext);
    const [styleClass, setStyleClass] = useState("");
    const [courses, setCourses] = useState(["Course A", "Course B", "Course C"]);

    useEffect(() => {
        auth.userLoggedIn ? setStyleClass("sidebar-on") : setStyleClass("");
    }, [auth.userLoggedIn])

    return (
        auth.userLoggedIn ?
            <nav className={`menu ${styleClass}`} tabIndex="0">
                <div className="smartphone-menu-trigger"></div>
                <header className="avatar">
                    <h2>Welcome</h2>
                </header>
                <ul>
                    {courses.map((course, i) => <li key={i} tabIndex="0" className="icon-dashboard" > <span>{course}</span></li>)}
                </ul>
            </nav >
            :
            <></>
    );
}

export default SideMenu;
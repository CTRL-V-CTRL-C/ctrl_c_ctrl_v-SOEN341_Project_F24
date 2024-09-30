import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Styles/NavBar.css';
import AuthContext from '../../Context/AuthContext';
import { useContext } from "react";
import { postData } from '../../Controller/FetchModule';

function NavBar() {
    const [scrollTop, setScrollTop] = useState(0);
    const auth = useContext(AuthContext);

    async function handleLogout() {
        await postData("/api/logout", {}, "POST");
        auth.setUserLoggedIn(false);
    }

    useEffect(() => {
        const onScroll = e => {
            setScrollTop(e.target.documentElement.scrollTop);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [scrollTop]);

    return (
        <nav className="nav affix">
            <div id="mainListDiv" className="main_list">
                <ul className="navlinks">
                    <li><NavLink className="navlink" to="/">Home</NavLink></li>
                    <div className="spacer" />
                    {auth.userLoggedIn ?
                        <li><NavLink onClick={(async () => { await handleLogout() })} className="navlink" to="/">Logout</NavLink></li>
                        :
                        <>
                            <li><NavLink className="navlink" to="/loginAccount">Login</NavLink></li>
                            <li><NavLink className="navlink" to="/registerAccount">Sign Up</NavLink></li>

                        </>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
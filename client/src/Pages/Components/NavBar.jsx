import { NavLink } from 'react-router-dom';
import './Styles/NavBar.css';
import UserContext from '../../Context/UserContext';
import { useContext } from "react";
import { postData } from '../../Controller/FetchModule';

function NavBar() {
    const auth = useContext(UserContext);

    async function handleLogout() {
        await postData("/api/logout", {});
        auth.setUserLoggedIn(false);
    }

    return (
        <nav className="nav affix">
            <div id="mainListDiv" className="main_list">
                <ul className="navlinks">
                    <div className="spacer" />
                    {auth.userLoggedIn ?
                        <>
                            <li><NavLink className="navlink" to="/teams">Teams</NavLink></li>
                            <li><NavLink onClick={(async () => { await handleLogout() })} className="navlink" to="/">Logout</NavLink></li>
                        </>
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
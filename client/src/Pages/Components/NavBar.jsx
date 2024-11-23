import { NavLink } from 'react-router-dom';
import './Styles/NavBar.css';
import UserContext from '../../Context/UserContext';
import { useContext } from "react";
import { postData } from '../../Controller/FetchModule';

function NavBar() {
    const userContext = useContext(UserContext);

    async function handleLogout() {
        await postData("/api/logout", {});
        userContext.setUserLoggedIn(false);
    }

    return (
        <nav className="nav affix">
            <div id="mainListDiv" className="main_list">
                <ul className="navlinks">
                    <div className="spacer" />
                    {userContext.userLoggedIn ?
                        <>
                            <li><NavLink to="/documentUpload" className="navlink" >Documents</NavLink></li>
                            <li><NavLink id="TeamsNav" className="navlink" to="/teams">Teams</NavLink></li>
                            <li><NavLink onClick={(async () => { await handleLogout() })} id="LogoutnNav" className="navlink" to="/">Logout</NavLink></li>
                        </>
                        :
                        <>
                            <li><NavLink id="LoginNav" className="navlink" to="/loginAccount">Login</NavLink></li>
                            <li><NavLink id="SignupNav" className="navlink" to="/registerAccount">Sign Up</NavLink></li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
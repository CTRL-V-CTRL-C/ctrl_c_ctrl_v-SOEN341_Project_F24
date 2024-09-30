import './Styles/NavBar.css';
import AuthContext from '../../Context/AuthContext';
import { useContext } from "react";
import { postData } from '../../Controller/FetchModule';
import { useNavigate } from 'react-router-dom';

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogout() {
        await postData("/api/logout", {}, "POST");
        auth.setUserLoggedIn(false);
        console.log("LOGGING OUT");
    }

    return (
        <div id="navbar">
            <div id="nav-sub">
                <li>
                    <a href="/">
                        Home
                    </a>
                </li>
            </div>
            <div className="nav-sub">
                {
                    auth.userLoggedIn ?
                        <a href='#'>
                            <p onClick={(async () => { await handleLogout(); navigate("/"); })} href="/home">
                                Logout
                            </p>
                        </a>
                        :
                        <>
                            <li>
                                <a href="/loginAccount"> Login </a>
                            </li>
                            <li>
                                <a href="/registerAccount"> Sign Up </a>
                            </li>
                        </>
                }
            </div>
        </div>
    );
}

export default NavBar;
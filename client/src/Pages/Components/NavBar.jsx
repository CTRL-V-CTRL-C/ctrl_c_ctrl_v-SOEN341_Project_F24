import { useState } from 'react';
import './Styles/NavBar.css';
/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {

    const [userLoggedIn, setUserLoggerIn] = useState(false)

    async function handleLogout() {
        await fetch("/authentication/logout");
        auth.setUserLoggedIn(false);
    }

    return (
        <div id="navbar">
            <div class="nav-sub">
                <li>
                    <a href="/"> Home </a>
                </li>
            </div>
            <div class="nav-sudb">
                <li>
                    <a href="/loginAccount"> Login </a>
                </li>
                <li>
                    <a href="/registerAccount"> Sign Up </a>
                </li>
            </div>
            
        </div>
    );
}

export default NavBar;
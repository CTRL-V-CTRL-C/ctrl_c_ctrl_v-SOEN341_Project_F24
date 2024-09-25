import './Styles/NavBar.css';

function NavBar() {

    //const [userLoggedIn, setUserLoggerIn] = useState(false);

    return (
        <div id="navbar">
            <div className="nav-sub">
                <li>
                    <a href="/"> Home </a>
                </li>
            </div>
            <div className="nav-sub">
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
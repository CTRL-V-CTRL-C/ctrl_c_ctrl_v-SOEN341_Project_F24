import UserContext from "../Context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate, Route, Navigate, useLocation, Outlet } from 'react-router-dom'

const loginRoute = "/loginAccount";

function RequireAuth() {
    const userContext = useContext(UserContext);
    const location = useLocation();
    if (!userContext.userLoggedIn) {
        return <Navigate to={loginRoute} state={{ from: location }} replace />;
    }
    return <Outlet />;
}

export default RequireAuth;
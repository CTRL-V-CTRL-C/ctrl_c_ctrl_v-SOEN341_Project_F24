import UserContext from "../Context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types';

const loginRoute = "/loginAccount";
const unAuthorizedPage = "/youShouldNotBeHere";

function RequireAuth({ shouldBeInstructor }) {
    const userContext = useContext(UserContext);
    const location = useLocation();
    if (!userContext.userLoggedIn) {
        return <Navigate to={loginRoute} state={{ from: location }} replace />;
    }
    if (shouldBeInstructor !== undefined && shouldBeInstructor !== userContext.isInstructor) {
        return <Navigate to={unAuthorizedPage} state={{ from: location }} replace />;
    }
    return <Outlet />;
}

RequireAuth.propTypes = {
    shouldBeInstructor: PropTypes.bool
}

export default RequireAuth;
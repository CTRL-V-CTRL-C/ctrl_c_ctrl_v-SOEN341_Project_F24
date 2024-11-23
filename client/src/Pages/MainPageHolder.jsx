import UnauthorizedPage from './Unauthorized';
import RegisterAccountPage from './RegisterAccountPage';
import LoginPage from './LoginPage';

import { Routes, Route } from "react-router-dom";

export default function MainPageHolder() {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route exact path='/loginAccount' element={<LoginPage />} />
            <Route exact path="/youShouldNotBeHere" element={<UnauthorizedPage />} />
        </Routes>
    )
}
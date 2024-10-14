import { Routes, Route } from 'react-router-dom';
import RegisterAccountPage from './RegisterAccountPage';
import LoginPage from './LoginPage';
import TeamsPage from './Components/TeamsPage';
import OtherTeams from './Components/OtherTeams';

function PageHolder() {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/teams" element={<TeamsPage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route exact path='/loginAccount' element={<LoginPage />} />
            <Route exact path='/OtherTeams' element={<OtherTeams />} />
        </Routes>
    );
}

export default PageHolder;
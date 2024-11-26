import { Routes, Route } from 'react-router-dom';
import RegisterAccountPage from './RegisterAccountPage';
import LoginPage from './LoginPage';
import TeamsPage from './Components/TeamsPage';
import RequireAuth from './RequireAuth';
import UnauthorizedPage from './Unauthorized';
import DocumentsPage from './DocumentsPage';
import MainContentWrapper from './Components/MainContentWrapper';

function PageHolder() {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route element={
                <MainContentWrapper>
                    <RequireAuth />
                </MainContentWrapper>
            } >
                <Route exact path="/teams" element={<TeamsPage />} />
                <Route exact path="/documents" element={<DocumentsPage />} />
            </Route>
            <Route exact path='/loginAccount' element={<LoginPage />} />
            <Route exact path="/youShouldNotBeHere" element={<UnauthorizedPage />} />
        </Routes>
    );
}

export default PageHolder;
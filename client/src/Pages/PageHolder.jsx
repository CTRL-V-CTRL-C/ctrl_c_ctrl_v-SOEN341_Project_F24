import { Routes, Route } from 'react-router-dom';
import RegisterAccountPage from './RegisterAccountPage';
import LoginPage from './LoginPage';
import TeamsPage from './Components/TeamsPage';
import RequireAuth from './RequireAuth';
import DocumentUpload from './DocumentUpload';

function PageHolder() {
    return (
        <Routes>
            <Route path="*" element={<LoginPage />} />
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route element={<RequireAuth />} >
                <Route exact path="/teams" element={<TeamsPage />} />
            </Route>
            <Route exact path='/loginAccount' element={<LoginPage />} />
            <Route element={<RequireAuth />} >
                <Route exact path="/documents" element={<DocumentUpload />} />
            </Route>
        </Routes>
    );
}

export default PageHolder;
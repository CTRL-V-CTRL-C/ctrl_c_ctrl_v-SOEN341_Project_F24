import { Routes, Route } from 'react-router-dom';
import RegisterAccountPage from './RegisterAccountPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import CVSUpload from './CVS_Upload';

function PageHolder() {
    return (
        <Routes>
            <Route path="*" element={<HomePage />} />
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route exact path='/loginAccount' element={<LoginPage/>} /> 
            <Route exact path='/CVSUpload' element={<CVSUpload/>} /> 
        </Routes>
    );
}

export default PageHolder;
import { Routes, Route } from 'react-router-dom';
import RegisterAccountPage from './RegisterAccountPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';

function PageHolder() {
    return (
        <Routes>
            <Route path="*" element={<HomePage />} />
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/registerAccount" element={<RegisterAccountPage />} />
            <Route exact path='/loginAccount' element={<LoginPage/>} /> 
        </Routes>
    );
}

export default PageHolder;
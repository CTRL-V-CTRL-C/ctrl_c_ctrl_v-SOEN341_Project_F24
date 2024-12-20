import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../Controller/FetchModule';
import FormInput from './Components/Forms/FormInput';
import UserContext from "../Context/UserContext";
import './LoginPage.css';

function LoginPage() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        navigate(userContext.userLoggedIn ? "/teams" : "/loginAccount");
    }, [userContext.userLoggedIn, navigate]);

    async function loginAccount(event) {
        //Stops the form from submitting
        event.preventDefault();

        //Prevent multiple submissions
        setIsButtonDisabled(true);

        //Login post
        const loginResponse = await postData("/api/login", { email: email.normalize("NFKC").toLocaleLowerCase(), password: password.normalize("NFKC") });
        const loginJSON = await loginResponse.json();

        if (loginResponse.status === 200) {
            userContext.setUserLoggedIn(true);
            userContext.setUserID(loginJSON.userId);
            userContext.setIsInstructor(loginJSON.isInstructor);
            userContext.setHasCourses(false);
            setMessage(loginJSON.msg);
            navigate("/teams");
        } else {
            setMessage(loginJSON.msg);
        }
        setIsButtonDisabled(false);
    };

    return (
        <div className="registration-form">
            <form className="form login-form" onSubmit={(e) => loginAccount(e)}>
                <p className="title">Login </p>
                <FormInput id="LoginEmail" fieldName={"Email"} fieldType={"email"} setField={setEmail} />
                <FormInput id="LoginPassword" fieldName={"Password"} fieldType={"password"} setField={setPassword} />
                <div className="error-message">
                    {message && <p>{message}</p>}
                </div>
                <button disabled={isButtonDisabled} className="submit" type='submit'>Sign In</button>
                <p className="signin">Don&apos;t have an account? <a href="/registerAccount">Create Account</a>  </p>
            </form>
        </div>
    );
}
export default LoginPage;
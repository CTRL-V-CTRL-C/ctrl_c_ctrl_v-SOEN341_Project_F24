import { useState } from 'react';
import FormInput from './Components/Forms/FormInput';
import './LoginPage.css';

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    async function loginAccount(event) {

        //Stops the form from submitting
        event.preventDefault();

        //Prevent multiple submissions
        setIsButtonDisabled(true);

        //Login post
        const loginURL = new URL("/api/login", location.origin);
        const loginResponse = await fetch(loginURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password: password })
        });

        const loginJSON = await loginResponse.json();

        if (loginResponse.status === 200) {
            setMessage(loginJSON.msg);
        } else {
            setMessage(loginJSON.msg);
        }



        // // Get stored user data from localStorage
        // const storedUserData = localStorage.getItem("userData");

        // if (storedUserData) {
        //     // Parse the stored user data
        //     const parsedUserData = JSON.parse(storedUserData);

        //     // Compare the email and password entered with the stored data
        //     if (
        //         email === parsedUserData.email &&
        //         password === parsedUserData.password
        //     ) {
        //         console.log("Login successful!"); //test
        //         setMessage("Login successful!");//just for now (should redirect)
        //     } else {
        //         console.log("Invalid email or password."); //test
        //         setMessage("Invalid email or password.");
        //     }
        // } else {
        //     console.log("Invalid email or password.");//test
        //     setMessage("Invalid email or password.");
        // }

        setIsButtonDisabled(false);
    };

    return (
        <div className="registration-form">
            <form className="form login-form" onSubmit={(e) => loginAccount(e)}>
                <p className="title">Login </p>
                <FormInput fieldName={"Email"} fieldType={"text"} setField={setEmail} />
                <FormInput fieldName={"Password"} fieldType={"password"} setField={setPassword} />
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
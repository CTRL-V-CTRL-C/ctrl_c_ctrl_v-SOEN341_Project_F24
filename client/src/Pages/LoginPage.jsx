import React, { useState } from "react";
import FormInput from './Components/Forms/FormInput';
import './LoginPage.css';

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");


    function Login(event) {

        //Stops the form from submitting
        event.preventDefault();


        // Get stored user data from localStorage
        const storedUserData = localStorage.getItem("userData");

        if (storedUserData) {
            // Parse the stored user data
            const parsedUserData = JSON.parse(storedUserData);

            // Compare the email and password entered with the stored data
            if (
                email === parsedUserData.email &&
                password === parsedUserData.password
            ) {
                console.log("Login successful!"); //test
                setMessage("Login successful!");//just for now (should redirect)
                
            } else {
                console.log("Invalid email or password."); //test
                setMessage("Invalid email or password.");
            }
        } else {
            console.log("Invalid email or password.");//test
            setMessage("Invalid email or password.");
        }
    };

    return (
        <div className="login-wrap">
            <div className="card">
                <form className="login-form" onSubmit={(e) =>Login(e)}>
                    <p className="title">Login </p>
                    <div className="userinfo">
                        <FormInput fieldName={"Email"} fieldType={"email"} setField={setEmail} />
                    </div>
                    <div className="userinfo">
                        <FormInput fieldName={"Password"} fieldType={"password"} setField={setPassword} />
                    </div>
                    <div className = "error-message">
                    {message && <p>{message}</p>}
                    </div>
                    <input type="submit" value="Login" className="btn" />
                    <p className="forgotPassword"> <a href="/home">Forgot password</a> </p>
                    <p className="login">Don't have an account? <a href="/registerAccount">Create Account</a> </p>
                </form>
            </div>
            
        </div>
    );
}
export default LoginPage;
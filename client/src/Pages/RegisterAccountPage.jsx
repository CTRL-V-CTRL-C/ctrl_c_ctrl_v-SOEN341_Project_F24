import './RegisterAccountPage.css';
import { useCallback, useEffect, useState } from 'react';
import FormInput from './Components/Forms/FormInput';
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import { postData } from '../Controller/FetchModule';
import { useNavigate } from "react-router-dom";

function RegisterAccountPage() {

  const navigate = useNavigate();

  const [isInstructor, setIsInstructor] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(<RxCrossCircled color='red' />);
  const [isPasswordValid, setIsPasswordValid] = useState(<RxCrossCircled color='red' />);
  const [arePasswordsCorrect, setArePasswordsCorrect] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Check if the confirm password is the same as the original password
  const checkPassword = useCallback(() => {
    if (password == confirmPassword && confirmPassword.length >= 8) {
      setIsPasswordConfirmed(<RxCheckCircled color='green' />);
      setArePasswordsCorrect(true);
    } else {
      setIsPasswordConfirmed(<RxCrossCircled color='red' />);
      setArePasswordsCorrect(false);
    }
  }, [password, confirmPassword]);

  // Validate both password and confirm password whenever password is changed
  useEffect(() => {
    setSubmitEnabled(false);
    checkPassword();
    if (password.length >= 8) {
      setIsPasswordValid(<RxCheckCircled color='green' />);
    } else {
      setIsPasswordValid(<RxCrossCircled color='red' />);
    }
  }, [password, checkPassword]);

  // Only allow submission if all fields have been entered
  useEffect(() => {
    setSubmitEnabled((firstname && lastname && email && userID && password && confirmPassword && arePasswordsCorrect));
  }, [firstname, lastname, email, userID, password, confirmPassword, arePasswordsCorrect]);

  // Validate password confirmation whenever it is changed
  useEffect(() => {
    checkPassword();
  }, [confirmPassword, checkPassword]);

  // Handles form submit
  // Creates an account with the information filled in the form
  function registerAccount(event) {
    event.preventDefault(); //Stops the form from submitting
    let form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    (async () => {
      const role = isInstructor ? "INST" : "STUD";
      const dataResponse = await postData("/api/user/create", {
        "username": email,
        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "schoolID": userID,
        "role": role,
        "password": password
      }, "POST");
      const data = await dataResponse.json();
      setFeedbackMessage(data.created ? navigate("/login") : "ERROR: Account creation failed");
    })();
  }

  return (
    <div className="registration-form">
      <form className="form" onSubmit={(e) => registerAccount(e)}>
        <p className="title">Create an Account </p>
        <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
          <input type="checkbox" id="filter" checked={isInstructor} onChange={() => setIsInstructor(!isInstructor)} />
          <span>STUDENT</span>
          <span>INSTRUCTOR</span>
        </label>

        <div className="flex">
          <FormInput fieldName={"Firstname"} fieldType={"text"} setField={setFirstname} />
          <FormInput fieldName={"Lastname"} fieldType={"text"} setField={setLastname} />
        </div>
        <FormInput fieldName={"Email"} fieldType={"email"} setField={setEmail} />
        <FormInput fieldName={isInstructor ? "Instructor ID" : "Student ID"} fieldType={"text"} setField={setUserID} />
        <FormInput fieldName={"Password"} fieldType={"password"} setField={setPassword} isPasswordValid={isPasswordValid} />
        <FormInput fieldName={"Confirm Password"} fieldType={"password"} setField={setConfirmPassword} isPasswordValid={isPasswordConfirmed} />
        <button disabled={!submitEnabled} className="submit" type='submit'>Sign Up</button>
        <div className="error-message">
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div> <p className="signin">Already have an account ? <a href="/loginPage">Sign in</a> </p>
      </form>
    </div>
  );
}

export default RegisterAccountPage;
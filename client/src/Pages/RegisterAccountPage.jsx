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

  const namePattern = "^[a-zA-Z'\\-]+$";
  const emailPattern = "^[a-zA-Z0-9.]+@[A-Za-z0-9]+\\.[A-Za-z0-9]+$";
  const studentIDPattern = "^[Ss][Tt][Uu][Dd][0-9]{4,4}$";
  const InstructorIDPattern = "^[Ii][Nn][Ss][Tt][0-9]{4,4}$";

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
        "firstName": firstname.normalize("NFKC").toLocaleLowerCase(),
        "lastName": lastname.normalize("NFKC").toLocaleLowerCase(),
        "email": email.normalize("NFKC").toLocaleLowerCase(),
        "schoolID": userID.normalize("NFKC").toLocaleUpperCase(),
        "role": role.normalize("NFKC").toLocaleUpperCase(),
        "password": password.normalize("NFKC")
      });
      const data = await dataResponse.json();
      setFeedbackMessage(data.created ? navigate("/loginAccount") : "ERROR: Account creation failed");
    })();
  }

  return (
    <div className="registration-form">
      <form className="form" onSubmit={(e) => registerAccount(e)}>
        <p className="title">Create an Account </p>
        <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
          <input type="checkbox" id="filter" checked={isInstructor} onChange={() => setIsInstructor(!isInstructor)} />
          <span id="StudentAccountSelect">STUDENT</span>
          <span id="InstructorAccountSelect">INSTRUCTOR</span>
        </label>

        <div className="flex">
          <FormInput id ="RegisterFirstName" fieldName={"Firstname"} pattern={namePattern} fieldType={"text"} setField={setFirstname} />
          <FormInput id ="RegisterLastName" fieldName={"Lastname"} pattern={namePattern} fieldType={"text"} setField={setLastname} />
        </div>
        <FormInput id ="RegisterEmail" fieldName={"Email"} pattern={emailPattern} fieldType={"email"} setField={setEmail} />
        <FormInput id ="RegisterId" fieldName={isInstructor ? "Instructor ID" : "Student ID"} pattern={isInstructor ? InstructorIDPattern : studentIDPattern} fieldType={"text"} setField={setUserID} />
        <FormInput id ="RegisterPassword" fieldName={"Password"} fieldType={"password"} setField={setPassword} isPasswordValid={isPasswordValid} />
        <FormInput id ="RegisterConfirmPassword" fieldName={"Confirm Password"} fieldType={"password"} setField={setConfirmPassword} isPasswordValid={isPasswordConfirmed} />
        <button disabled={!submitEnabled} className="submit" type='submit' id="SignUp">Sign Up</button>
        <div className="error-message">
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div> <p className="signin">Already have an account ? <a href="/loginPage">Sign in</a> </p>
      </form>
    </div>
  );
}

export default RegisterAccountPage;
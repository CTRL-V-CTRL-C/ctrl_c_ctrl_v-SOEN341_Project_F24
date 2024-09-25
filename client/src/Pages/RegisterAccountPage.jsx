import './RegisterAccountPage.css';
import { useEffect, useState } from 'react';
import FormInput from './Components/Forms/FormInput';
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";


function RegisterAccountPage() {

  const [isInstructor, setIsInstructor] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(<RxCrossCircled color='red'/>);
  const [isPasswordValid, setIsPasswordValid] = useState(<RxCrossCircled color='red'/>);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  useEffect(() => {
    setSubmitEnabled(false);
    checkPassword()
    if (password.length >= 8) {
      setIsPasswordValid(<RxCheckCircled color='green'/>);
    } else {
      setIsPasswordValid(<RxCrossCircled color='red'/>);
    }
  }, [password]);

  useEffect(() => {
    checkPassword();
    
  }, [confirmPassword]);

  function checkPassword() {
    if (password == confirmPassword && confirmPassword.length >= 8) {
      setIsPasswordConfirmed(<RxCheckCircled color='green'/>);
      setSubmitEnabled(true);
    } else {
      setIsPasswordConfirmed(<RxCrossCircled color='red'/>);
      setSubmitEnabled(false);
    }
  }

  function registerAccount(e) {
    if(!(firstname && lastname && email && userID && password)) {
      return;
    }
    console.log("registering account with: \n");
    console.log(isInstructor)
    console.log(firstname);
    console.log(lastname);
    console.log(email)
    console.log(userID);
    console.log(password);
    console.log("-----end-----");
  }

  return (
    <div className="registration-form">
      <div className="form">
        <p className="title">Create an Account </p>
        <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
          <input type="checkbox" id="filter" checked={isInstructor} onChange={() => setIsInstructor(!isInstructor)}/>
          <span>STUDENT</span>
          <span>INSTRUCTOR</span>
        </label>

        <div className="flex">
          <FormInput fieldName={"Firstname"} fieldType={"text"} setField={setFirstname}/>
          <FormInput fieldName={"Lastname"} fieldType={"text"} setField={setLastname}/>
        </div>
        <FormInput fieldName={"Email"} fieldType={"email"} setField={setEmail}/>
        <FormInput fieldName={isInstructor ? "Instructor ID" : "Student ID"} fieldType={"text"} setField={setUserID}/>
        <FormInput fieldName={"Password"} fieldType={"password"} setField={setPassword} isPasswordValid={isPasswordValid}/>
        <label>
            <input required placeholder="" type={"password"} className="input" onChange={(e) => setConfirmPassword(e.target.value)}/>
            <span className="field-label">{"Confirm Password"}{isPasswordConfirmed} </span>
        </label>
        <button disabled={!submitEnabled} className="submit" onClick={registerAccount}>Sign Up</button>
        <p className="signin">Already have an account ? <a href="/loginPage">Sign in</a> </p>
      </div>
    </div>
  );
}

export default RegisterAccountPage;

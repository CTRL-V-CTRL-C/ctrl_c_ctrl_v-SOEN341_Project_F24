import './RegisterAccountPage.css';
import { useCallback, useEffect, useState } from 'react';
import FormInput from './Components/Forms/FormInput';
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import { postData } from '../Controller/FetchModule';
// import loadArgon2idWasm from 'argon2id';
// import { Argon2BrowserHashOptions } from 'argon2-browser'

function RegisterAccountPage() {

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

  // Check if the confimr password is the same as the original password
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
  // TODO: Description
  function registerAccount(event) {
    //Stops the form from submitting
    event.preventDefault();
    console.log("hhh")
    let form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    (async () => {
      let role = isInstructor ? "INST" : "STUD";
      let password_hash = "passwordhash";
      let password_salt = "ao3nd9ueh748ewdn"

      // Argon2BrowserHashOptions.hash({ pass: password, salt: password_salt })
      //   .then(h => password_hash = h)
      //   .catch(e => console.error(e.message, e.code))

      console.log("Here")

      const data = await postData("/api/user/create", {
        "username": email,
        "firstName": firstname,
        "lastName": lastname,
        "email": email,
        "schoolID": userID,
        "role": role,
        "password_hash": password_hash,
        "salt": password_salt,
      }, "POST");
      console.log(data)
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
        <p className="signin">Already have an account ? <a href="/loginPage">Sign in</a> </p>
      </form>
    </div>
  );
}

export default RegisterAccountPage;
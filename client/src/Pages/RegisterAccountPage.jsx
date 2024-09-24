import FormInput from './Components/Forms/FormInput';
import './RegisterAccountPage.css';

function RegisterAccountPage() {

  return (
    <div className="registration-form">
      <form className="form">
        <p className="title">Create an Account </p>
        <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
          <input type="checkbox" id="filter" />
          <span>STUDENT</span>
          <span>INSTRUCTOR</span>
        </label>

        <div className="flex">
          <FormInput fieldName={"Firstname"} fieldType={"text"} />
          <FormInput fieldName={"Lastname"} fieldType={"text"} />
        </div>
        {/* <FormInput fieldName={"Email"} fieldType={"email"} /> */}
        <FormInput fieldName={"Student ID"} fieldType={"text"} />
        <FormInput fieldName={"Password"} fieldType={"password"} />
        <FormInput fieldName={"Confirm Password"} fieldType={"password"} />
        <button className="submit">Sign Up</button>
        <p className="signin">Already have an account ? <a href="/loginPage">Sign in</a> </p>
      </form>
    </div>
  )
}

export default RegisterAccountPage;

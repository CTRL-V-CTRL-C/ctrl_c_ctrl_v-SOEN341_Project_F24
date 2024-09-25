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
          <label>
            <input required="" placeholder="" type="text" className="input" />
            <span>Firstname</span>
          </label>

          <label>
            <input required="" placeholder="" type="text" className="input" />
            <span>Lastname</span>
          </label>
        </div>
        {/* 
        <label>
          <input required="" placeholder="" type="email" className="input" />
          <span>Email</span>
        </label> */}

        <label>
          <input required="" placeholder="" type="text" className="input" />
          <span>Student ID</span>
        </label>

        <label>
          <input required="" placeholder="" type="password" className="input" />
          <span>Password</span>
        </label>
        <label>
          <input required="" placeholder="" type="password" className="input" />
          <span>Confirm password</span>
        </label>
        <button className="submit">Sign Up</button>
        <p className="signin">Already have an account ? <a href="/loginAccount">Sign in</a> </p>
      </form>
    </div>
  )
}

export default RegisterAccountPage;

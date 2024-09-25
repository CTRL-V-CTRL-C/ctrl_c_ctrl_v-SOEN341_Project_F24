import './LoginPage.css';

function LoginPage() {
    return (
        
        <div className="card">
            
            <form class="login-form">
            <p className="title">Login </p>
                <div class="userinfo">
                    <input type="text" class="form-control" placeholder="username" />
                </div>

                <div class="userinfo">
                    <input type="password" class="form-control" placeholder="password" />
                </div>
                <input type="submit" value="Login" class="btn" />
                <p className="forgotPassword"> <a href="/home">Forgot password</a> </p> 
                <p className="login">Don't have an account ? <a href="/registerAccount">Create Account</a> </p>
            </form>
        </div>
    );
}
export default LoginPage;
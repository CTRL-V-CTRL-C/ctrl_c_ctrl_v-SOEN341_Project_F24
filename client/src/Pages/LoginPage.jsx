import './LoginPage.css';

function LoginPage() {
    return (
        <div className="card">
            <form class="login-form">
                <div class="userinfo">
                    <input type="text" class="form-control" placeholder="username" />
                </div>

                <div class="userinfo">
                    <input type="password" class="form-control" placeholder="password" />
                </div>
                <div class="submit">
                    <input type="submit" value="Login" class="btn" />
                </div>
            </form>
        </div>
    );
}
export default LoginPage;
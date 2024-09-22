import './LoginPage.css'

function LoginPage(){
    return(
        <>
        <div class="container"></div>
    <div className="d-flex justify-content-center h-100"></div>
    <div className="card">
        <form class="login-form">
            <div class="userinfo">
                <input type="text" class="form-control" placeholder="username"/>
            </div>

            <div class="userinfo">
                <input type="password" class="form-control" placeholder="password"/>
            </div>
            <div class="submit">
                <input type="submit" value="Login" class="btn"/>
            </div>
        </form>
    </div>
        </>
    )
}
export default LoginPage
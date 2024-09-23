import * as React from 'react';
import './LoginPage.css'

function LoginPage() {
    return (
        <>
            <img src="https://www.concordia.ca/content/dam/common/logos/Concordia-logo.jpeg"
                alt="concordia logo" width="300" height="100" />

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

        </>
    )
}
export default LoginPage
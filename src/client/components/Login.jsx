import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';

class Login extends Component {
  componentDidMount() {
    const { resetLoginInfo, resetLeaderboardLoadingContent, resetRenderScoreFooter, resetFooterBool } = this.props;
    resetLoginInfo();
    resetLeaderboardLoadingContent();
    resetRenderScoreFooter();
    resetFooterBool();
  }

  render() {
    const { updateLoginEmail, updateLoginPassword, submitLogin, isLoggedIn, loginInputEmail, loginInputPassword, loginError, loginErrorMsg, selectedGame, passwordReset } = this.props;

    const loginInfoObj = {
      email_address: loginInputEmail,
      password: loginInputPassword,
    };

    let errorMsg = '';

    if (isLoggedIn & selectedGame !== '') {
      const selectedGameRoute = `/gameMenu/${selectedGame}`;
      return <Redirect to={selectedGameRoute} />;
    } else if (isLoggedIn) {
      return <Redirect to='/' />;
    }

    if (loginError) {
      errorMsg = <span>{loginErrorMsg}</span>;
    } else if (passwordReset) {
      errorMsg = <span>Your password has been successfully reset. Please login with your new password.</span>;
    }

    const forgotPassword = <span><NavLink to="/forgot-pw">Forgot Password?</NavLink></span>;

    return (
      <div className="UserContainer">
        <div className="grid">
          <h1>Login</h1>
          <form className="form login">
            <div className="form__field">
              <span className="hidden">Email</span>
              <input id="login__email" type="email" name="email" className="form__input" value={loginInputEmail} placeholder="Email" autoCorrect="off" onChange={updateLoginEmail} required />
            </div>
            <div className="form__field">
              <span className="hidden">Password</span>
              <input id="login__password" type="password" name="password" className="form__input" value={loginInputPassword} placeholder="Password" onChange={updateLoginPassword} required />
            </div>
            <div className="error-text">
              {errorMsg}
            </div>
            <div className="text--center">
              {forgotPassword}
            </div>
            <div className="form__field">
              <input type="button" onClick={() => submitLogin(loginInfoObj)} value="Login" />
            </div>
          </form>
          <div className="text--center">
            <div className="">Don't have an account? <NavLink className="loginSignupLink" to="/signup"> Sign up.</NavLink></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

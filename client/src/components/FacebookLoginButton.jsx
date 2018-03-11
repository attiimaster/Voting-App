import React, { Component } from 'react';
export default class FacebookLogin extends Component {

  componentDidMount() {
    document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  //Init FB object and check Facebook Login status
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  }

  //Check login status
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  }

  //Check login status and call login api if user is not logged in
  facebookLogin = () => {
    if (!this.FB) return;
    this.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, {scope: 'public_profile'});
      }
    }, );
  }
  
  //Handle login response
  facebookLoginHandler = response => {
    if (response.status === 'connected') {
      this.FB.api('/me', userData => {
        let result = {
          ...response,
          user: userData
        };
        fetch("/facebookAuth", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData
          })
        })
        this.props.onLogin(true, result);
      });
    } else {
      this.props.onLogin(false);
    }
  }

  //Or log user out ==> in app.js for now
  facebookLogout = () => {
    window.FB.getLoginStatus(res => {
      //console.log("this.props")
      //console.log(this.props) 
      if(res.status === 'connected') {
        window.FB.logout(function(response) { 
          alert("You have been logged out!")
          window.location.reload()
          // Person is now logged out
        });
      }
    })
  }

  render() {
    let {children} = this.props;
    //console.log("isAuth: " + this.props.isAuth)
    if(this.props.isAuth) {
      return (
        <div onClick={this.facebookLogout}>
          <p className="welcome">Welcome back, {this.props.username.split(" ")[0]}! <button>Logout</button></p>
        </div>
        )
    }
    return (
      <div onClick={this.facebookLogin}>
        {children}
      </div>
    );
  }
}
import React, { Component } from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.0.0";
import "assets/demo/demo.css";

import Home from "views/Index.jsx";
import LandingPage from "views/examples/LandingPage.jsx";
import RegisterPage from "views/examples/RegisterPage.jsx";
import ProfilePage from "views/examples/ProfilePage.jsx";
import UploadFilePage from "views/examples/UploadFilePage.jsx";
class Index extends Component {
  constructor(props) {
    super(props);
    this.addNamesCourses = this.addNamesCourses.bind(this);
    this.state = {
      names: ["Val", "Hudson"],
      courses: ["4040", "2020"]
    }

  }


  addNamesCourses(names, courses) {
    this.setState({names: names,
                  courses: courses})
  }



  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/home" render={props => <Home {...props} names={this.state.names} courses={this.state.courses} />} />
          <Route
            path="/landing-page"
            render={(props) => <LandingPage {...props} />}
          />
          <Route
            path="/register-page"
            render={(props) => <RegisterPage {...props} />}
          />
          <Route
            path="/profile-page"
            render={props => <ProfilePage {...props} />}
          />
          <Route
            path="/upload-page"
            render={(props) => <UploadFilePage {...props} addNamesCourses={this.addNamesCourses} />}
          />
          <Redirect from="/" to="/upload-page" />
        </Switch>
      </BrowserRouter>
    );
    }


}


ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

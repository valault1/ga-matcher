import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as XLSX from 'xlsx';



import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.0.0";
import "assets/demo/demo.css";

import Home from "views/Home.jsx";
import LandingPage from "views/examples/LandingPage.jsx";
import RegisterPage from "views/examples/RegisterPage.jsx";
import ProfilePage from "views/examples/ProfilePage.jsx";
import UploadFilePage from "views/examples/UploadFilePage.jsx";





class Index extends Component {
  constructor(props) {
    super(props);
    this.addNamesCourses = this.addNamesCourses.bind(this);
    this.state = {
      nameSheet: [],
      courseSheet: []
    }

  }


  addNamesCourses(newNameSheet, newCourseSheet) {
    this.setState({nameSheet: newNameSheet,
                  courseSheet: newCourseSheet})
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/home" render={props => <Home {...props} nameSheet={this.state.nameSheet} courseSheet={this.state.courseSheet} />} />
          <Route
            path="/upload-page"
            render={(props) => <UploadFilePage {...props} addNamesCourses={this.addNamesCourses} />}
          />
          <Route
            path="/profile-page"
            render={(props) => <ProfilePage {...props} addNamesCourses={this.addNamesCourses} />}
          />
          <Route
            path="/register-page"
            render={(props) => <RegisterPage {...props} addNamesCourses={this.addNamesCourses} />}
          />
          <Route
            path="/landing-page"
            render={(props) => <LandingPage {...props} addNamesCourses={this.addNamesCourses} />}
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

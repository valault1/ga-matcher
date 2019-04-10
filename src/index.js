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
    this.addAvailableTa = this.addAvailableTa.bind(this);
    this.deleteAvailableTa = this.deleteAvailableTa.bind(this);
    this.state = {
      nameSheet:[],
      courseSheet:[],
      coursesTa:[],
      availableTAs:[],

      courses: [{
        courseName: "Comp-1900",
        crn: 5432,
        TAHOURSNeeded: 25,
        TAHOURSUsed: 0,
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
      }],
      tas: [{
        firstName: "Hudson",
        lastName: "Gribble",
        coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
        CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
        HoursAvailable: 15,
        HourseUsed: 0,
        UofMID: "U045345",
        available: true,
        english: true
      }]
    }

  };


  addAvailableTa(courseTa, crn, taIndex, UofMID) {
    console.log("I am in the addAvailableTa function");
    console.log(courseTa);
    console.log(crn);
    console.log(taIndex);
    console.log(UofMID);


    console.log(this.state.courses);

    // let TaArray = this.state.courses[0].CourseTA;
    // TaArray[0] = courseTa;
    // console.log(TaArray);
    let that = this;

    // let courseObject = this.state.courses;
    // console.log(courseObject);
    // courseObject[0].CourseTA[0] = courseTa;
    // console.log(courseObject[0].CourseTA[0]);
    // this.setState({
    //   courses: courseObject
    // })
    let index = 0;
    this.state.courses.forEach(function(course) {

      if (course.crn === crn)
      {
        //console.log(TaArray);
        console.log("Hello");

        let courseObjectTest = that.state.courses;
        console.log(taIndex);
        courseObjectTest[index].CourseTA[taIndex] = courseTa;
        courseObjectTest[index].TaUofMID[taIndex] = UofMID;

        that.setState({
           courses: courseObjectTest,
        });

      }
      index++;
    });
    console.log(this.state.courses[0].CourseTA[0]);
  }

  deleteAvailableTa(courseTa) {
    console.log(courseTa);
  }

  addNamesCourses(newNameSheet, newCourseSheet) {

    let dropDown = []

    newCourseSheet.forEach((element) => {
      console.log(element);

      if(element[2] === "Key") {
        return;
      }
      if(element[2] === undefined) {
        const key = element[1];
        dropDown.push({ [key] : "TA's" });
      }
      else {
        const key = element[2];
        dropDown.push({ [key] :"TA's" });
      }



    });
    console.log(dropDown);


    this.setState({nameSheet: newNameSheet,
                  courseSheet: newCourseSheet,
                  availableTAs: newNameSheet,
                  coursesTa: dropDown});
  }

  render() {
    console.log(this.state);
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/home"
          render={props => <Home {...props} addAvailableTa={this.addAvailableTa.bind(this)} deleteAvailableTa={this.deleteAvailableTa.bind(this)} testProps={this.state}availableTas={this.state.availableTas} coursesTa={this.state.courseTa} nameSheet={this.state.nameSheet} courseSheet={this.state.courseSheet} courses={this.state.courses} tas={this.state.tas} />} />
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

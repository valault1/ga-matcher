import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.0.0";
import "assets/demo/demo.css";

import Home from "views/Home.jsx";
import UploadFilePage from "views/examples/UploadFilePage.jsx";





class Index extends Component {
  constructor(props) {
    super(props);
    this.addNamesCourses = this.addNamesCourses.bind(this);
    this.addAvailableTa = this.addAvailableTa.bind(this);
    this.deleteAvailableTa = this.deleteAvailableTa.bind(this);
    this.updatingHoursUsed = this.updatingHoursUsed.bind(this);
    this.state = {
      nameSheet:[],
      courseSheet:[],
      coursesTa:[],
      availableTAs:[],

      courses: [
        {
        courseName: "Comp-1900",
        crn: 5432,
        TAHOURSNeeded: 25,
        TAHOURSUsed: [0,0,0],
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
        },
        {
        courseName: "Comp-2700",
        crn: 5442,
        TAHOURSNeeded: 15,
        TAHOURSUsed: [0,0,0],
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
        },
        {
        courseName: "Comp-2900",
        crn: 5242,
        TAHOURSNeeded: 15,
        TAHOURSUsed: [0,0,0],
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
        },
        {
        courseName: "Comp-3100",
        crn: 23442,
        TAHOURSNeeded: 15,
        TAHOURSUsed: [0,0,0],
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
        },
        {
        courseName: "Comp-3300",
        crn: 8442,
        TAHOURSNeeded: 15,
        TAHOURSUsed: [0,0,0],
        TA_Attendance: true,
        CourseTA: ["TA's", "TA's", "TA's"],
        TaUofMID: ["TaID", "TaID", "TaID"],
        CourseStartTime: "1400",
        CourseEndTime: "1600",
        English_Preffered: true
        }
      ],
      tas: [
        {
          firstName: "Hudson",
          lastName: "Gribble",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U045345",
          available: true,
          english: true
        },
        {
          firstName: "Hunter",
          lastName: "Gribble",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U045367",
          available: true,
          english: true
        },
        {
          firstName: "Val",
          lastName: "Ault",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U045390",
          available: true,
          english: true
        },
        {
          firstName: "Hollie",
          lastName: "Gillihan",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U245390",
          available: true,
          english: true
        },
        {
          firstName: "Alex",
          lastName: "Stackley",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U445390",
          available: true,
          english: true
        },
        {
          firstName: "Johnathan",
          lastName: "Glenn",
          coursesTaken: {"COMP-1900":"A", "COMP-2700":"B"},
          CourseRecommendToTeach: ["COMP-1900", "COMP-2700"],
          HoursAvailable: 15,
          HoursUsed: [0,0,0],
          inputsUsed: ['','',''],
          UofMID: "U545390",
          available: true,
          english: true
        },

    ]
    }

  };

  //This function will be taking care of switching out and adding the availableTa to the correct course.
  addAvailableTa(courseTa, crn, taIndex, uofmID, prevUofmID, inputID, hours) {
    console.log("I am in the addAvailableTa function");
    console.log(courseTa);
    console.log(crn);
    console.log(taIndex);
    console.log(uofmID);
    console.log(hours);
    console.log(prevUofmID);


    console.log(this.state.courses);

    // let TaArray = this.state.courses[0].CourseTA;
    // TaArray[0] = courseTa;
    // console.log(TaArray);
    let that = this;
    let coursesObject = this.state.courses; // will be used to make the new array of course objects.
    console.log(coursesObject);
    let tasObject = this.state.tas; // will be used to make the new array of tas objects.
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
        // console.log("Hello");
        //
        // let courseObjectTest = that.state.courses;
        // console.log(taIndex);
        // courseObjectTest[index].CourseTA[taIndex] = courseTa;
        // courseObjectTest[index].TaUofMID[taIndex] = UofMID;
        //
        // that.setState({
        //    courses: courseObjectTest,
        // });

        coursesObject[index].CourseTA[taIndex] = courseTa;
        coursesObject[index].TaUofMID[taIndex] = uofmID;
        coursesObject[index].TAHOURSUsed[taIndex] = hours;

      }
      index++;
    });

    let indexForTaArray = 0;
    this.state.tas.forEach(function(ta) {
      if (prevUofmID === ta.UofMID)
      {
        if (inputID === tasObject[indexForTaArray].inputsUsed[0]) {
            console.log("I am in here the first if statement changing prevUofmID hours and InputID");
          tasObject[indexForTaArray].HoursUsed[0] = "0";
          tasObject[indexForTaArray].inputsUsed[0] = '';
        }
        else if(inputID === tasObject[indexForTaArray].inputsUsed[1]) {
          console.log("I am in here the else if statement changing prevUofmID hours and InputID");
          tasObject[indexForTaArray].HoursUsed[1] = "0";
          tasObject[indexForTaArray].inputsUsed[1] = '';
        }
        else {
          console.log("I am in here the else statement changing prevUofmID hours and InputID");
          tasObject[indexForTaArray].HoursUsed[2] = "0";
          tasObject[indexForTaArray].inputsUsed[2] = '';
        }

      }

      if (ta.UofMID === uofmID && !(hours === undefined)) {
        console.log("I am in the loop");
            if (tasObject[indexForTaArray].inputsUsed[0] === '' || inputID === tasObject[indexForTaArray].inputsUsed[0]) {
                console.log("I am in here the first if statement");
              tasObject[indexForTaArray].HoursUsed[0] = hours;
              tasObject[indexForTaArray].inputsUsed[0] = inputID;
            }
            else if(tasObject[indexForTaArray].inputsUsed[1] === '' || inputID === tasObject[indexForTaArray].inputsUsed[1]) {
              console.log("I am in here the else if statement");
              tasObject[indexForTaArray].HoursUsed[1] = hours;
              tasObject[indexForTaArray].inputsUsed[1] = inputID;
            }
            else {
              console.log("I am in here the else statement");
              tasObject[indexForTaArray].HoursUsed[2] = hours;
              tasObject[indexForTaArray].inputsUsed[2] = inputID;
            }
      }


      ++indexForTaArray;
    })
    console.log(this.state.courses[0].CourseTA[0]);

    this.setState({
      courses: coursesObject,
      tas: tasObject
    });
  }

  deleteAvailableTa(courseTa) {
    console.log(courseTa);
  }

  addNamesCourses(new_tas, new_courses, new_tas_dict, new_courses_dict) {

    let dropDown = []

    new_tas.forEach((element) => {
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


    this.setState({nameSheet: new_tas,
                  courseSheet: new_courses,
                  availableTAs: new_tas,
                  coursesTa: dropDown,
                  courses: new_courses,
                  tas: new_tas,
                  tas_dict: new_tas_dict,
                  courses_dict: new_courses_dict});
  }


  updatingHoursUsed(inputID, hours, uofmID, indexForTaHour, crn) {
    console.log("Hey I have made it to the updating Hours function");
    console.log(inputID);
    console.log(hours);
    console.log(uofmID);
    console.log(crn);
    let tasObject = this.state.tas;

    console.log(tasObject);


    let index = 0;
    //This will be used for updating the state of the TA

    //This will be used for updating the state of the courses;
    let coursesObject = this.state.courses;

    this.state.tas.forEach((ta) => {
      //IF the first index is empty put it in there else go down the array and find an open spot.
      if (ta.UofMID === uofmID) {
        console.log("I am in the loop");
            if (tasObject[index].inputsUsed[0] === '' || inputID === tasObject[index].inputsUsed[0]) {
                console.log("I am in here the first if statement");
              tasObject[index].HoursUsed[0] = hours;
              tasObject[index].inputsUsed[0] = inputID;
            }
            else if(tasObject[index].inputsUsed[1] === '' || inputID === tasObject[index].inputsUsed[1]) {
              console.log("I am in here the else if statement");
              tasObject[index].HoursUsed[1] = hours;
              tasObject[index].inputsUsed[1] = inputID;
            }
            else {
              console.log("I am in here the else statement");
              tasObject[index].HoursUsed[2] = hours;
              tasObject[index].inputsUsed[2] = inputID;
            }
      }


      // if (ta.UofMID === prevUofmID) {
      //       if (tasObject[index].inputID[0] === inputID) {
      //         tasObject[index].HoursUsed[0] = '';
      //         tasObject[index].inputID[0] = '';
      //       }
      //
      //       else if(tasObject[index].inputID[1] === inputID) {
      //         tasObject[index].HoursUsed[1] = '';
      //         tasObject[index].inputID[1] = '';
      //       }
      //       else {
      //         tasObject[index].HoursUsed[2] = hours;
      //         tasObject[index].inputID[2] = inputID;
      //       }
      // }
      ++index;
    });
    //Adding the TAHOURSUsed from the course
    let index2 = 0;
    this.state.courses.forEach((course) => {
      if (course.crn === crn ) {
        coursesObject[index2].TAHOURSUsed[indexForTaHour] = hours;
      }
    ++index2;

    });


    this.setState({
      tas: tasObject,
      courses: coursesObject
    });

}

  render() {
    console.log(this.state);
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/home"
          render={props => <Home {...props} updatingHoursUsed={this.updatingHoursUsed.bind(this)} addAvailableTa={this.addAvailableTa.bind(this)} deleteAvailableTa={this.deleteAvailableTa.bind(this)} testProps={this.state}availableTas={this.state.availableTas} coursesTa={this.state.courseTa} nameSheet={this.state.nameSheet} courseSheet={this.state.courseSheet} courses={this.state.courses} tas={this.state.tas} tas_dict={this.state.tas_dict} courses_dict={this.state.courses_dict} />} />
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

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
var debug=true;
var sheet1, sheet2;




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
  //Add feature that auto-uploads a given file,
  //So we don't have to upload it every time we change something
  
  if (debug) {
    console.log("RUNNING IN DEBUG MODE");
    var fs = require('fs');
    var f;
    fs.readFile('../info/Data Entry.xlsx', function read(err, data) {
        if (err) {
            throw err;
        }
        f = data;

        // Invoke the next step here however you like
        processFile();          // Or put the next step in a function and invoke it
    });

    function processFile() {
      console.log(f);
      var name = f.name;
      const reader = new FileReader();
  


      /*evt = on_file_select event */
      var that=this;
      reader.onload = (evt) => { 
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const wsname1 = wb.SheetNames[0];
        const ws1 = wb.Sheets[wsname1];
        /* Get second worksheet */
        const wsname2 = wb.SheetNames[1];
        const ws2 = wb.Sheets[wsname2];
        /* Convert array of arrays */
        sheet1 = XLSX.utils.sheet_to_json(ws1, {header:1});
        sheet2 = XLSX.utils.sheet_to_json(ws2, {header:1});
        console.log(sheet1);
        console.log(sheet2);
        var courses=[], names=[];
        for(var i=1; i < sheet1.length; i++) {
          courses.push(sheet1[i][2]);
        }
        for(var i=1; i < sheet2.length; i++) {
          names.push(sheet2[i][1]);
        }
        /* Update state */
        //console.log("courses: " + courses);
        //console.log("names: " + names);
        that.props.addNamesCourses(sheet2, sheet1);
        document.getElementById('home-link').click();
      };
      reader.readAsBinaryString(f);
      console.log("File processed");
    }
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

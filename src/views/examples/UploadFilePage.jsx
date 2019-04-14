import React from "react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";



import classnames from "classnames";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";



// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import { watchFile } from "fs";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

var Papa = require('papaparse');
var sheet1, sheet2;



class UploadFilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.fileInput = React.createRef();


  }
  
  handleSubmit(event) {
    event.preventDefault();
    //takes in the default workbook generated, outputs a dictionary object ex
    /*
    {
      "Registration History": [
        class1,
        class2...
      ]
      "Classes": [
        class1,
        class2...
      ]
      "GA Schedules": [
        class1,
        class2...
      ]
      "GA": [
        ga1,
        ga2...
      ]
      "GA Matchings": [
        kault: "this will be replaced by his evaluation when you click a course button",
        hgrbble1: "this will be replaced by his evaluation when you click a course button"
        ...
      ]
    }

    */
    function wbToSheets(wb) {
      //Turns the workbook into a dictionary with sheet names as keys and sheets as values
      var wbObject = {}
      //console.log(JSON.stringify(Object.keys(wb.Sheets["GA"])))

      for (var i=0; i < wb.SheetNames.length; i++) {
        //sheetName is the name of this sheet
        var sheetName= wb.SheetNames[i];
        //sheet is the content of this sheet
        let sheet = wb.Sheets[sheetName];
        var csv = XLSX.utils.sheet_to_csv(sheet);
        var parsed = Papa.parse(csv, {
          header: true
         })
         
        wbObject[wb.SheetNames[i]] =parsed.data;

      }

     
      
      return wbObject;
    }
    function processWorkbook(wb) {
      //turns wb to new_wb and then to final_data
      //
      /*final_data has 4 keys:
        ga_dict = dictionary that stores ga objects with uuid as keys
        GA = list of ga's
        class_dict = dictionary that stores class objects with key : COMP10001 is COMP1000 section 1
        Classes = list of classes
        editing a class in class_dict also edits it in classes, and vice versa; same for ga's
      */
      

      //End: wb["GA"]["kault"].grades = 
      /*
      {
        COMP4201 : "A"
      }
      

      */
      var ga_dict = {};
      for (let x in wb["GA"]) {
        ga_dict[wb["GA"][x]['uuid']] = wb["GA"][x];
        ga_dict[wb["GA"][x]['uuid']]['grades'] = {};
        ga_dict[wb["GA"][x]['uuid']]['schedule'] = [];
        
      }
      wb['ga_dict'] = ga_dict;



      console.log("NOW PROCESSING WORKBOOK");
      var new_wb = JSON.parse(JSON.stringify(wb)); // allows it to copy the values, and not the reference
      
      for (let y = 0; y < new_wb['Registration History'].length; y++) {
        var courseTaken = new_wb['Registration History'][y];
        var courseName = courseTaken["Subject_Area"] + courseTaken["Course_Number"];
        if (new_wb['ga_dict'][courseTaken['uuid']] == undefined) { continue; } //don't process if the course was taken by someone not on our list of GA's
        var ga = new_wb['ga_dict'][courseTaken['uuid']];
        if (!(courseName in new_wb['ga_dict'][ga['uuid']]["grades"])) { //have they taken the course before?
          //take the better of the 2 grades. A < B < C < D < F < W
          new_wb['ga_dict'][ga['uuid']]["grades"][courseName] = courseTaken["Grade"];
        }
        else {
          if (courseTaken["Grade"] != "" && courseTaken["Grade"] < new_wb['ga_dict'][ga['uuid']]["grades"][courseName]) {
            new_wb['ga_dict'][ga['uuid']]["grades"][courseName] = courseTaken["Grade"];
          }
        }
        
      }
      //Part two: Generate current schedules
      var gaClasses = new_wb['GA schedules'];
      for (let x = 0; x < gaClasses.length; x++) {
        let course = gaClasses[x];
        if (new_wb['ga_dict'][course['uuid']] == undefined) {continue;}
        let ga = new_wb['ga_dict'][course['uuid']];

        let schedule = {};
        if (course['Days'] != "") {
          schedule['Days'] = course['Days'];
          schedule['Start_Time'] = parseInt(course['Start_Time']);
          schedule['Stop_Time'] = parseInt(course['Stop_Time']);
          ga.schedule.push(schedule);
          new_wb['ga_dict'][course['uuid']] = ga;
        }
        
      }

      var final_data = JSON.parse(JSON.stringify(new_wb)); //a copy of the new_wb

      //Part 3: Making sure the ga_dict matches the GA array
      delete final_data['GA'];
      final_data['GA'] = []
      for(var key in final_data['ga_dict']) {
        final_data['GA'].push(final_data['ga_dict'][key]);
        final_data['ga_dict'][key].HoursAvailable = final_data['ga_dict'][key]['Hours'];
        final_data['ga_dict'][key].HoursUsed = [0,0,0];
        final_data['ga_dict'][key].inputsUsed = ['','',''];
        final_data['ga_dict'][key].UofMID = final_data['ga_dict'][key]['U#'];
        final_data['ga_dict'][key].available = true;
        final_data['ga_dict'][key].firstName = final_data['ga_dict'][key]['First'];
        final_data['ga_dict'][key].lastName = final_data['ga_dict'][key]['Last'];


      }
      //part 4: Giving each class a schedule and making a class dictionary
      //Using Key Subject_Area+ Course_Number+Section_Number
      final_data['class_dict'] = {};
      for (var key in final_data['Classes']) {
        let course = final_data['Classes'][key];
        course.schedule = {};
        course.schedule['Days'] = course['Days'];
        course.schedule['Start_Time'] = parseInt(course['Start_Time']);
        course.schedule['Stop_Time'] = parseInt(course['Stop_Time']);
        let course_key = course['CRN'];
        final_data['class_dict'][course_key] = course;
        /*updating courses to have this structure
          {
          courseName: "Comp-3100",
          crn: 23442,
          TAHOURSNeeded: 15,
          TAHOURSUsed: 0,
          TA_Attendance: true,
          CourseTA: ["TA's", "TA's", "TA's"],
          TaUofMID: ["TaID", "TaID", "TaID"],
          CourseStartTime: "1400",
          CourseEndTime: "1600",
          English_Preffered: true
          },
        */
          course.courseName = course['Subject_Area'] + course['Course_Number'];
          course.crn = course['CRN'];
          course.TAHOURSNeeded = course.TAHOURSNeeded;
          course.TAHOURSUsed = 0;
          course.CourseTA = ["TA's", "TA's", "TA's"];
          course.TaUofMID = ["TaID", "TaID", "TaID"];
      }

      
      
      delete final_data['Registration History'];
      delete final_data['GA schedules'];
      console.log("FINISHED PROCESSING WORKBOOK, here is final_data:")
      console.log(final_data);
      var notes = "";
      for (var i = 0; i < 20; i++) {
        let ga = final_data['GA'][i];
        let course = final_data['Classes'][0];
        ga['notes'] = "";
        checkSchedule(ga, course, notes);
        checkGrade(ga, course, notes);
        console.log("For ga " + ga['uuid'] + " and course " + course['Course_Number'] + ":");
        console.log(ga['notes']);
        
      }

      //NOTE: When you edit a ga in ga_dict, it will change in GA as well, and vice versa
      //This goes for classes as well; What we have is 
      return final_data;
      
    }

    //takes a GA and a course
    //returns if that GA made an A in that course
    //edits notes to say what grade GA got in that course
    function checkGrade(ga, course, notes) {
      let courseName = course['Subject_Area'] + course['Course_Number'];
      let grade = ga.grades[courseName];
      if (grade == undefined) {
        ga['notes'] += "\nThis student hasn't taken the course at University of Memphis.";
        
      }
      else {
        ga['notes'] += "\nThis student got a grade of " + grade + " in this course.";
      
      }
      return (grade == 'A' || grade == 'A-' || grade == 'A+');
    }


    //takes a ga and a course object
    //returns if that GA is free at the time of that class
    //edits notes to say that the GA is free or not
    function checkSchedule(ga, course, notes) {
      
      var c = JSON.parse(JSON.stringify(course.schedule));
      c['Days'] = c['Days'].split('');
      for (var i = 0; i < ga.schedule.length; i++) {
        var g = JSON.parse(JSON.stringify(ga.schedule[i])); // copy by value, so we don't edit the original schedule
        
        g['Days'] = g['Days'].split('');
        var union = [...new Set([...c['Days'], ...g['Days']])]; 
        // ^ Takes the union of the sets of days
        //For example, 'WF' becomes ['W', 'F'] and then see if any overlap
        //If this union's size is now as long as the two combined, none overlapped.
        if (union.length != c['Days'].length + g['Days'].length) {
          /*DEBUG
          console.log("DAYS OVERLAP");
          console.log("c['Start_Time']:" + c['Start_Time'])
          console.log("c['Stop_Time']:" + c['Stop_Time'])
          console.log("g['Start_Time']:" + g['Start_Time'])
          console.log("g['Stop_Time']:" + g['Stop_Time'])*/
          //At least one day overlaps, so check the hours
          if ((c['Start_Time'] <= g['Start_Time'] && g['Start_Time'] <= c['Stop_Time'])
          ||  (c['Start_Time'] <= g['Stop_Time'] && g['Stop_Time'] <= c['Stop_Time'])) {
            //If the ga's class's start or stop time lies between the class's start and stop time, then there is a conflict.
            ga['notes'] += "This student has a class at that time.";
            return false;
          }

        }        
      }
      //We didn't find a conflict
      ga['notes'] += "This student is free at that time";
      return true;
    }


    var f = this.fileInput.current.files[0]
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
        var data = wbToSheets(JSON.parse(JSON.stringify(wb)));
        var final_data = processWorkbook(JSON.parse(JSON.stringify(data)));
        
        //processWorkbook(sheets);
        sheet1 = XLSX.utils.sheet_to_json(ws1, {header:1});
        sheet2 = XLSX.utils.sheet_to_json(ws2, {header:1});
        
        
        //In sheets, I'll store the values of the column names mapped to their index on each sheet
        var sheets = {};
        for (var i=0; i < wb.SheetNames.length; i++) {
          //sheetName is the name of this sheet
          var sheetName= wb.SheetNames[i];
          //sheet is the content of this sheet
          var sheet = wb.Sheets[sheetName];
          //header is the row with the names of the values; ex. "Schedule"
          var header = sheet[0];
          

          var csv = XLSX.utils.sheet_to_csv(sheet);
          var parsed = Papa.parse(csv, {
            header: true
          })
          //console.log(parsed);
          sheets[sheetName] = parsed.data;
          
          
        }
        
        /*
          Method for checking if a student has time or not:
          - go through each of the days, and each of the times on each of those days
          - Read the class range, and make sure the beginning of the class is greater than the end number or lower than the beginning number
          - Then check that the end of the class is less less than the begin number or greater than the end number
          
        */
        /*
        SHEETS
        {
          
            GA's: 
              [
                { 
                  name: Val
                  lname: Ault
                  English: true
                  Schedule:
                },
                {
                  name: Hudson
                  lname: Gribble
                  English: false
                  Schedule: 
                }
              ]
          
            
            Courses:
              [
                {
                  course number: 4401
                  CRN: 663012
                  Teacher: Sen,
                  Schedule: {
                    M: ["1220-1325"]
                    W: ["1220-1325"]
                  }
                },
                {
                  course number: 6040
                  CRN: 663012
                  Teacher: Fatih
                }
              ],

              RegistrationHistory: {
                U00511339: {
                  currentSchedule: {
                    M: "1420-1545"
                    T: ["1120-1245", "1300-1425", "1440-1605"]
                    W: [1420-1545]
                    R: [1120-1245, 1300-1425, 1440-1605]
                    F:
                    S:


                  }
                  pastClasses: {
                    COMP3410: 'A'

                  }
                }
              }
            
          
        }


        */
        console.log(sheets);
        
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
        that.props.addNamesCourses(final_data['GA'], final_data['Classes'], final_data['ga_dict'], final_data['class_dict']);
        document.getElementById('home-link').click();
    };
    reader.readAsBinaryString(f);
    console.log("File processed");
  }


  clickFileInput() {
    document.getElementById('file-input-button').click();

  }


  render() {
    return (
      <>

      <ExamplesNavbar />

      <div className="wrapper">
        <div className="page-header">

        <Container className="align-items-center" style={{paddingTop: "20vh"}}>
          <Row>
            <Col className="col-sm align-items-center">
                <div className="align-items-center">
                <button class="btn btn-primary btn-round" type="button" id="attach" onClick={this.clickFileInput}>
                  <i class="tim-icons icon-attach-87"></i> Attach File
                </button>



                <Link to="/home" id='home-link'/>
                  <button class="btn btn-primary btn-round" type="button" id="send" onClick={this.handleSubmit}>
                    <i class="tim-icons icon-check-2"></i>
                    Start editing

                  </button>
                </div>

            </Col>

          </Row>
        </Container>
      {/*<h1>This is the upload page.</h1><br/>*/}





        <label>
          <input type="file" id="file-input-button" ref={this.fileInput} hidden="true" />
        </label>
        <br />

      </div>
      </div>
      </>
    );
  }
}

export default UploadFilePage;

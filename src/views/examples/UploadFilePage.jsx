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
import PrimaryNavBar from "components/Navbars/PrimaryNavBar.jsx";
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

    //Takes a wb object, returns a dictionary with sheets named after the sheets in the wb object
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
         console.log(parsed);
         
        wbObject[wb.SheetNames[i]] =parsed.data;

      }
      console.log("ORIGINAL DATA FROM SHEET:");
      console.log(wbObject);
      //make enrollment an int, so we can add overlapping classes together
      for (var i=0; i < wbObject['Classes'].length; i++) {
        let c = wbObject['Classes'][i];
        c['Actual_Enrollment'] = parseInt(c['Actual_Enrollment']);
      }

      //delete any empty rows
      for (var i=0; i < wbObject['GA'].length; i++) {
        let g = wbObject['GA'][i]
        if (g['uuid'] == '' || g['uuid'] == null ) {
          wbObject['GA'].splice(i, 1);
        }
      }


      for (var i=0; i < wbObject['Classes'].length; i++) {
        
        let c = wbObject['Classes'][i];
        //Skip classes if they are any of these, or if they are the same teacher as another
        //OR if they are online classes (Section begins with R)
        //OR if they are null
        var classes_to_skip = 'COMP4911,COMP6911,COMP7901,COMP8901,COMP7980,COMP9000,COMP7996'.split(',');

        if (c['Course_Number'] == '' || c['Course_Number'] == null || classes_to_skip.indexOf(c['Subject_Area'] + c['Course_Number']) >= 0 || c['Section_Number'].startsWith('R')) {
          console.log("DELETING COURSE " + c['CRN'] + " " + c['Title']);
          wbObject['Classes'].splice(i, 1);
          i -=1;
        }
        else {
          console.log("KEEPING COURSE " + c['CRN'] + " " + c['Title']);
        }
      }

      //Combine classes that are G and U versions of same class
      //Look for classes that start with 4 or 7, and then see if there is another class with same teacher, days, time, and last 3 digits
      for (var i=0; i < wbObject['Classes'].length; i++) {
        var c = wbObject['Classes'][i];
        if (c['Course_Number'].startsWith('4') || c['Course_Number'].startsWith('7')) {
          console.log("CHECKING CLASS " + c['CRN'] + " " + c['Subject_Area'] + c['Course_Number']);
          for (var j=0; j < wbObject['Classes'].length; j++) {
            let c2 = wbObject['Classes'][j];
            let cFirstNumber = c['Course_Number'].slice(0,1);
            let c2FirstNumber = c2['Course_Number'].slice(0,1);
            if (c['Instructor_UUID'] === c2['Instructor_UUID'] && c['Days'] === c2['Days'] 
                && c['Start_Time'] === c2['Start_Time'] && c['Stop_Time'] === c2['Stop_Time'] 
                && c['Course_Number'].slice(1) === c2['Course_Number'].slice(1)
                && ((cFirstNumber === '4' && c2FirstNumber === '6' )|| (cFirstNumber === '7' && c2FirstNumber === '8'))
                && j !== i) {
                  // Combine the classes
                  c['Actual_Enrollment'] = c['Actual_Enrollment'] + c2['Actual_Enrollment'];
                  c['Course_Number'] = c['Course_Number'] + '/' + c2['Course_Number'];
                  wbObject['Classes'].splice(j, 1);
                  if (j < i) {
                    i -= 1;
                  }
                  
                  break;
                  
            }
          }

        }

      }
      
      

     
      
      return wbObject;
    }
    //turns wb to new_wb and then to final_data
    //Ends up with a list and dictionary of all classes and ta's, called final_data
    function processWorkbook(wb) {
      
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
      console.log(wb);
      var ga_dict = {};
      for (let x in wb["GA"]) {
        ga_dict[wb["GA"][x]['uuid']] = wb["GA"][x];
        ga_dict[wb["GA"][x]['uuid']]['grades'] = {};
        ga_dict[wb["GA"][x]['uuid']]['schedule'] = [];
        ga_dict[wb["GA"][x]['uuid']]['NameColor'] = 'text-white';
        
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
        if (final_data['ga_dict'][key]['F/H'] == 'F') {
          final_data['ga_dict'][key].HoursAvailable = 20;
        }
        else if (final_data['ga_dict'][key]['F/H'] == 'H') {
          final_data['ga_dict'][key].HoursAvailable = 10;
        }
        //initialize all colors of the hours to white
        final_data['ga_dict'][key].HoursAvailableColor = 'text-success';
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
          course.TAHOURSNeeded = Math.round((course['Actual_Enrollment'] / 2)/5) * 5;
          course.TAHOURSUsed = [0,0,0];
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

      //This is so they can select No TA for a class
      let NO_TA = {
        "F/H":"F",
        "First":"NO",
        "firstName":"NO",
        "Last":"TA",
        "HoursAvailable":0,
        "HoursAvailableColor": "text-success",
        "HoursUsed":["0","0","0"],
        "NameColor":"text-white",
        "Should_Not_Teach":"",
        "Should_Teach":"",
        "U#":"000000000",
        "grades":{},
        "inputsUsed":["","",""],
        "lastName":"TA",
        "schedule":[],
        "uuid":"0000000",
        "notes":"",
        "UofMID":"000000000"
      };
      final_data['GA'].push(NO_TA);
      final_data['ga_dict'][NO_TA.uuid] = NO_TA;
      
    

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
        ga['notes'] += "\nThis student hasn't taken this course.";
        
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

      <PrimaryNavBar />

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

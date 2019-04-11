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
    async function wbToSheets(wb) {
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

     
      processWorkbook(JSON.parse(JSON.stringify(wbObject)));
      return wbObject;
    }
    function processWorkbook(wb) {
      
      //Note: To check if str exists in list:
      //if (list.indexOf(str)) >= 0) {}
      //First: find all courses taken in the past, and get their grades
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
      console.log(wb);
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
      console.log(new_wb);
      //Part two: Generate current schedules
      var gaClasses = new_wb['GA schedules'];
      for (let x = 0; x < gaClasses.length; x++) {
        let course = gaClasses[x];
        if (new_wb['ga_dict'][course['uuid']] == undefined) {continue;}
        let ga = new_wb['ga_dict'][course['uuid']];

        let schedule = [];

        schedule.push(course['Days']);
        schedule.push(course['Start_Time']);
        schedule.push(course['Stop_Time']);
        ga.schedule.push(schedule);
        new_wb['ga_dict'][course['uuid']] = ga;
        
      }
      console.log(new_wb);
      
      var final_data = JSON.parse(JSON.stringify(new_wb)); //a copy of the new_wb
      delete final_data['Registration History'];
      delete final_data['GA schedules'];
      console.log(final_data);

      
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
        var sheets = wbToSheets(JSON.parse(JSON.stringify(wb)));
        
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
        that.props.addNamesCourses(sheet2, sheet1);
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

import React from "react";
import classnames from "classnames";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.jsx";
import PageHeader from "components/PageHeader/PageHeader.jsx";
import Footer from "components/Footer/Footer.jsx";

// sections for this page/view
import Basics from "views/IndexSections/old/Basics.jsx";
import Navbars from "views/IndexSections/old/Navbars.jsx";
import Tabs from "views/IndexSections/old/Tabs.jsx";
import Pagination from "views/IndexSections/old/Pagination.jsx";
import Notifications from "views/IndexSections/old/Notifications.jsx";
import Typography from "views/IndexSections/old/Typography.jsx";
import JavaScript from "views/IndexSections/old/JavaScript.jsx";
import NucleoIcons from "views/IndexSections/old/NucleoIcons.jsx";
import Signup from "views/IndexSections/old/Signup.jsx";
import Examples from "views/IndexSections/old/Examples.jsx";
import Download from "views/IndexSections/old/Download.jsx";
import PrimaryNavBar from "components/Navbars/PrimaryNavBar.jsx";
import Courses from "views/IndexSections/Courses.jsx";
import Names from "views/IndexSections/Names.jsx";

// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";


let nameStyles = {
  color: 'white'
}

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.handleclick = this.handleclick.bind(this);
      this.handleDropdownClick = this.handleDropdownClick.bind(this);
      this.handleSelectClick = this.handleSelectClick.bind(this);
      //Pass the props stuff to state, so it can be changed here instead of in the index
      this.state={
        courseSheet: this.props.courseSheet,
        nameSheet: this.props.nameSheet,
        nameStyler: {color: 'white'},
        value: ""


      };
    }
  componentDidMount() {

    console.log(this.props);
    // document.body.classList.toggle("index-page");
    // console.log(this.props.nameSheet);
    // console.log(this.props.courseSheet);
  }
  changeCourses() {
    this.props.courses[1] = {name:"COMP4700"};
  }
  componentWillUnmount() {
    document.body.classList.toggle("index-page");
  }

  handleclick() {
    console.log("I am the clickable label");
    this.setState({'nameStyler': {'color':'pink'}});
  }

  //This function does all of the css for having the dropdown working.
  //This function will aslso keep track of the prevUofmID for switching GA's
  handleDropdownClick(dropdownId, dropWrapId, dropMenuId, prevUofmID, e) {
    //Start of saving the state of prevUofmID
    this.setState({
      [dropdownId] : prevUofmID
    });
    //<!-- Functional drop down -->

    console.log("HandlingClick");
    console.log(dropdownId);

    const dropDown = document.getElementById(dropdownId);
    const dropDownMenu = document.getElementById(dropMenuId);
    const dropDownWrap = document.getElementById(dropWrapId);

    if (dropDown.getAttribute("aria-expanded") === "false") {
      dropDown.setAttribute("aria-expanded", "true");
      dropDownMenu.setAttribute("class", "dropdown-menu show");
      dropDownWrap.setAttribute("class", "dropdown show");
    }
    else {
      dropDown.setAttribute("aria-expanded", "false");
      dropDownMenu.setAttribute("class", "dropdown-menu");
      dropDownWrap.setAttribute("class", "dropdown");
    }
  //<!-- end of Functional dropdown logic -->




  //console.log(this.state[dropdownId]);

  }




  handleSelectClick(lastName, crn, taIndex, uofmID, prevUofmID, inputID, dropdownId, dropWrapId, dropMenuId, event) {
    console.log(lastName);

    const dropDown = document.getElementById(dropdownId);
    const dropDownMenu = document.getElementById(dropMenuId);
    const dropDownWrap = document.getElementById(dropWrapId);

    if (dropDown.getAttribute("aria-expanded") === "false") {
      dropDown.setAttribute("aria-expanded", "true");
      dropDownMenu.setAttribute("class", "dropdown-menu show");
      dropDownWrap.setAttribute("class", "dropdown show");
    }
    else {
      dropDown.setAttribute("aria-expanded", "false");
      dropDownMenu.setAttribute("class", "dropdown-menu");
      dropDownWrap.setAttribute("class", "dropdown");
    }
    console.log(inputID);
    console.log(this.state[inputID]);
    console.log("I am in the handleSelectClick");

  //if (this.state[inputID] === undefined )
  //{
  if (this.state[inputID] === undefined) {
    this.props.addAvailableTa(lastName, crn, taIndex, uofmID, prevUofmID, inputID, 0);
  } else {
    this.props.addAvailableTa(lastName, crn, taIndex, uofmID, prevUofmID, inputID, this.state[inputID]);
  }
  //}
  //else {
    //this.props.addAvailableTa(lastName, crn, taIndex, uofmID, prevUofmID, inputID, this.state[inputID]);
  //}


  }

  //takes a ga and a course object
  //returns if that GA is free at the time of that class
  //edits notes to say that the GA is free or not
    checkSchedule(ga, course) {
      ga['notes'] += "\n";

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

  checkGrade(ga, course, notes) {
    ga['notes'] = notes;
    let courseName = course['Subject_Area'] + course['Course_Number'];
    let grade = ga.grades[courseName];
    if (grade == undefined) {
      ga['notes'] += "\nThis student hasn't taken " + course.courseName + " at University of Memphis.";

    }
    else {
      ga['notes'] += "\nThis student got a grade of " + grade + " in this course.";

    }
    return (grade == 'A' || grade == 'A-' || grade == 'A+' || grade == 'IP');
  }

  courseClick(courseKey, rowId, event) {
    console.log(courseKey);
    console.log(this.props.courses_dict);
    console.log(rowId);

    const rowElements = document.querySelectorAll('div.row');
    console.log(rowElements);

    for (let i = 0; i < rowElements.length; i++) {
      let row = rowElements[i];
      console.log(row.attributes);
      // console.log(row.attributes[2].style);
      console.log(row.id);
      console.log(row.getAttribute("style"));

      if (row.getAttribute("style") !== "") {
        console.log("Am I getting here");
        console.log(row.id);
        console.log(row);
        //const element = document.getElementById(row.id);
        row.removeAttribute("style");
      }
      if (row.id === rowId) {
        row.setAttribute("style", "background-color: #d050dc70;");
      }
    }

    //trying to turn buttons blue, but didn't work
    //const button = document.getElementById(this.props.courses_dict[courseKey]['CRN'])
    //button.classList.remove("btn btn-primary btn-round");
    //button.classList.add("btn btn-secondary btn-round");



    this.props.tas.map((ta) => {

        if (this.checkGrade(ta, this.props.courses_dict[courseKey], '') || this.checkSchedule(ta, this.props.courses_dict[courseKey])) {
          const gradAssistant = document.getElementById(ta.UofMID);
          if (gradAssistant != undefined) {
            console.log("Am I ever getting called");
            gradAssistant.classList.remove("text-white");
            gradAssistant.classList.add("text-success");
            //gradAssistant.class = 'text-success';
            gradAssistant.title = ta['notes'];
          }
          else {
            console.log("TA NOT FOUND: ");
            console.log(ta);
          }
        }

        return null;
    });
    console.log("this.props.tas_dict = ");
    console.log(this.props.tas_dict);

  }

//This is taking care of the input change and storing the value of inputs//
//If a Non is input as the value of the input it will always go to 0.
  handleInputChange(uofmID, event) {
    //console.log(event.target.id);
    //console.log(TaID);
    //let name = event.target.name;
    //Checking if the input value is an integer or not.
    console.log("Hours");
    console.log(isNaN(event.target.value));

    if (isNaN(event.target.value) || event.target.value === "" ) {
      this.setState({
        [event.target.id]: '0'
      });
      //this.props.updatingHoursUsed(event.target.id, 0, uofmID);
    }
    else {
    this.setState({
      [event.target.id]: event.target.value
    });
    //this.props.updatingHoursUsed(event.target.id, event.target.id, uofmID);
  }
    console.log("this is the id of the input " + event.target.id);
    console.log(this.state[event.target.id]);
  }


  //This event makes the hours goes to the Ta's hoursUsed.
  handleOnBlurInput(uofmID, indexForTaHour, crn, event) {
    console.log(event.target.value);
    console.log(event.target.id);
    console.log(uofmID);
    console.log(crn);
    console.log("I am in the updating Blur Function");
    if(isNaN(event.target.value) || event.target.value === "") {
      console.log("I am in the not a number statement");
    this.props.updatingHoursUsed(event.target.id, '0', uofmID, indexForTaHour, crn);
    }
    else {
      this.props.updatingHoursUsed(event.target.id, event.target.value, uofmID, indexForTaHour, crn);
    }


  }

  render() {

    console.log(this.props);



    const dropDownMenu = (crn, taIndex, prevUofmID, inputID, dropdownId, dropWrapId, dropMenuId) => {

      return (this.props.tas.map((ta) => {
        // If the Ta is not available then do not show them as an option for selection.
        if (ta.available === true)  {
        return (<a class="dropdown-item" onClick={this.handleSelectClick.bind(this, ta.firstName + " " + ta.lastName, crn, taIndex, ta.UofMID, prevUofmID, inputID, dropdownId, dropWrapId, dropMenuId)}>{ta.firstName + " " + ta.lastName}</a>);
        }
      })
    );
    }

    const dropdown = (dropid, dropdownName, crn, taIndex, prevUofmID, inputID) => {


      let dropdownId = dropdownName + "dropDown" + dropid;
      let dropWrapId = dropdownName + "dropDownWrap" + dropid;
      let dropMenuId = dropdownName + "dropDownMenu" + dropid;

      console.log(dropid);

      return (
      <div class="dropdown"
            id={dropWrapId}>
            <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id={dropdownId}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={this.handleDropdownClick.bind(this, dropdownId, dropWrapId, dropMenuId, prevUofmID)}>
              {dropdownName}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id={dropMenuId}>
              {dropDownMenu(crn, taIndex, prevUofmID, inputID, dropdownId, dropWrapId, dropMenuId)}
            </div>
        </div>
      );
    }

    const makeInput = (id, taID, indexForTaHour, crn) => {
      return (
        <Input
          id={id}
          placeholder="TA's Hours"
          onChange={this.handleInputChange.bind(this, taID)}
          onBlur={this.handleOnBlurInput.bind(this, taID, indexForTaHour, crn)}
          >
          </Input>
      );
    }

    let id = 0
    let id1 = 1
    let id2 = 2
    const courseMap = this.props.courses.map((row) => {

      id = id + 3;
      id1 = id1 + 3;
      id2 = id2 + 3;
      return(
      <Row id={"row"+id}>
        <Col resizable={false} ><button id={row.CRN} class="btn btn-primary btn-round" type="button" id={row.crn} onClick={this.courseClick.bind(this, row.crn, "row"+id)}>{row.courseName}</button></Col>
        <Col resizable={false} ><label>{row.Title}</label></Col>
        <Col resizable={false} ><label>{row.Instructor_First_Name + " " + row.Instructor_Last_Name}</label></Col>
        <Col resizable={false} ><label>{ (parseInt(row.TAHOURSUsed[0]) + parseInt(row.TAHOURSUsed[1]) + parseInt(row.TAHOURSUsed[2])) } / {row.TAHOURSNeeded}</label></Col>
        <Col resizable={false} ><Row>{dropdown(id, row.CourseTA[0], row.crn, 0, row.TaUofMID[0], "input" + id)}{makeInput("input" + id, row.TaUofMID[0], 0, row.crn)}</Row></Col>
        <Col resizable={false} >{dropdown(id1, row.CourseTA[1], row.crn, 1, row.TaUofMID[1], "input" + (id+1))}{makeInput("input" + (id+1), row.TaUofMID[1], 1, row.crn)}</Col>
        <Col resizable={false} >{dropdown(id2, row.CourseTA[2], row.crn, 2, row.TaUofMID[2], "input" + (id+2))}{makeInput("input" + (id+2), row.TaUofMID[2], 2, row.crn)}</Col>
      </Row>
    );


    });

    var text = "hello.";
    text += "\n this is my text";

    const gaMap = this.props.tas.map((ta) => {
      //If the Ta is not available do not display the Ta
      if(ta.available === true) {
          if(ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2])) > 0) {
            return (
            <Row>
              <Col><Label className="text-white h3"><h5 className="text-white" id={ta.UofMID}>{ta.firstName + " " + ta.lastName}</h5></Label></Col>
              {/*//This will be used to tell how many more hours the Ta has available*/}

              <Col><label className="text-white"><h5 className="text-white">{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</h5></label></Col>
            </Row>
            );
          }
          else if (ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2])) === 0) {
            return (
            <Row>
              <Col><Label className="text-white h3"><h5 className="text-success" id={ta.UofMID}>{ta.firstName + " " + ta.lastName}</h5></Label></Col>
              {/*//This will be used to tell how many more hours the Ta has available*/}

              <Col><label className="text-success"><h4 className="text-success">{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</h4></label></Col>
            </Row>
            );
          }
          else {
            return (
            <Row>
              <Col><Label className="text-white h3" ><h5 className="text-danger" id={ta.UofMID}>{ta.firstName + " " + ta.lastName}</h5></Label></Col>
              {/*//This will be used to tell how many more hours the Ta has available*/}

              <Col><label className="text-danger"><h4 className="text-danger">{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</h4></label></Col>
            </Row>
            );
          }
      }

    }
    );
    return (
      <>
        <PrimaryNavBar/>
        <div className="wrapper">

          <div className="main">
            <Container-fluid>
            <Row>
            <Col md="3">
              <div className="section section-names" id="basic-elements">
                <h4 className="text-white">Potential GA's</h4>
                <Card>
                  <CardBody>

                    {gaMap}
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col>
            <div className="section section-courses" id="basic-elements">
              <h4 className="text-white">COURSES</h4>
              <Card>
                <CardBody>
                  <Row>
                    <Col><label><h3 className="text-white">Class Name</h3> </label></Col>
                    <Col><label>Number of Hours used  / needed</label></Col>
                    <Col>Selected TA 1<br/>Hours Used</Col>
                    <Col>Selected TA 3<br/>Hours Used</Col>
                    <Col>Selected TA 2<br/>Hours Used</Col>
                  </Row>
                  <Row><hr/></Row>
                  {courseMap}
                </CardBody>
              </Card>

            </div>
            </Col>
            </Row>
            </Container-fluid>

          </div>

        </div>
      </>
    );
  }
}

export default Home;

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

  //if (this.state[inputID] === undefined )
  //{
    this.props.addAvailableTa(lastName, crn, taIndex, uofmID, prevUofmID, inputID, this.state[inputID]);
  //}
  //else {
    //this.props.addAvailableTa(lastName, crn, taIndex, uofmID, prevUofmID, inputID, this.state[inputID]);
  //}


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
    return true;
    return (grade == 'A' || grade == 'A-' || grade == 'A+');
  }

  courseClick(courseKey, event) {
    console.log(courseKey);


    this.props.tas.map((ta) => {

        if (this.checkGrade(ta, this.props.courses_dict[courseKey], '')) {
          const gradAssistant = document.getElementById(ta.UofMID);
          if (gradAssistant != undefined) {
            gradAssistant.classList.remove("text-white");
            gradAssistant.classList.add("text-success");
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
    console.log(event.target.value);

    if (isNaN(event.target.value)) {
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
  handleOnBlurInput(uofmID, event) {
    console.log(event.target.value);
    console.log(event.target.id);
    console.log(uofmID);
    console.log("I am in the updating Blur Function");
    if(isNaN(event.target.value) || event.target.value === "") {
      console.log("I am in the not a number statement");
    this.props.updatingHoursUsed(event.target.id, '0', uofmID);
    }
    else {
      this.props.updatingHoursUsed(event.target.id, event.target.value, uofmID);
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

    const makeInput = (id, taID) => {
      return (
        <Input
          id={id}
          placeholder="TA's Hours"
          onChange={this.handleInputChange.bind(this, taID)}
          onBlur={this.handleOnBlurInput.bind(this, taID)}
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
      <Row>
        <Col><button class="btn btn-primary btn-round" type="button" id={row.crn} onClick={this.courseClick.bind(this, row.crn)}>{row.courseName}</button></Col>
        <Col><label>{row.TAHOURSUsed} / {row.TAHOURSNeeded}</label></Col>
        <Col><Row>{dropdown(id, row.CourseTA[0], row.crn, 0, row.TaUofMID[0], "input" + id)}{makeInput("input" + id, row.TaUofMID[0])}</Row></Col>
        <Col>{dropdown(id1, row.CourseTA[1], row.crn, 1, row.TaUofMID[1], "input" + (id+1))}{makeInput("input" + (id+1), row.TaUofMID[1])}</Col>
        <Col>{dropdown(id2, row.CourseTA[2], row.crn, 2, row.TaUofMID[2], "input" + (id+2))}{makeInput("input" + (id+2), row.TaUofMID[2])}</Col>
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
              <Col><Label className="text-white h3" id={ta.UofMID}><h4 className="text-white">{ta.firstName + " " + ta.lastName}</h4></Label></Col>
              {/*//This will be used to tell how many more hours the Ta has available*/}

              <Col><label className="text-white"><h4 className="text-white">{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</h4></label></Col>
            </Row>
            );
          }
          else if (ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2])) === 0) {
            return (
            <Row>
              <Col><Label className="text-white h3" id={ta.UofMID}><h4 className="text-success">{ta.firstName + " " + ta.lastName}</h4></Label></Col>
              {/*//This will be used to tell how many more hours the Ta has available*/}

              <Col><label className="text-success"><h4 className="text-success">{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</h4></label></Col>
            </Row>
            );
          }
          else {
            return (
            <Row>
              <Col><Label className="text-white h3" id={ta.UofMID}><h4 className="text-danger">{ta.firstName + " " + ta.lastName}</h4></Label></Col>
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
            <Container>
            <Row>
            <Col md="3">
              <div className="section section-names" id="basic-elements">
                Potential GA's<br/>
                <Card>
                  <CardBody>

                    {gaMap}
                  </CardBody>
                </Card>
              </div>
            </Col>
            <Col>
            <div className="section section-courses" id="basic-elements">
              COURSES
              <Card>
                <CardBody>
                  <Row>
                    <Col><label>Class Name </label></Col>
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
            </Container>

          </div>

        </div>
      </>
    );
  }
}

export default Home;

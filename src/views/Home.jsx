import React from "react";

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

  handleDropdownClick(dropdownId, dropWrapId, dropMenuId, e) {
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
  }

  handleSelectClick(lastName, crn, taIndex, UofMID, event) {
    console.log(lastName);
    this.props.addAvailableTa(lastName, crn, taIndex, UofMID);


  }

  courseClick(courseKey, event) {
    console.log(courseKey);
    this.props.tas.map((ta) => {

        if (ta.lastName === 'Gribble') {
          const gradAssistant = document.getElementById(ta.UofMID);
          gradAssistant.classList.remove("text-white");
          gradAssistant.classList.add("text-success");
        }

        return null;
    });
  }

  handleInputChange(TaID, event) {
    console.log(event.target.id);
    console.log(TaID);
    //let name = event.target.name;

    this.setState({
      [event.target.id]: event.target.value
    });
    console.log(this.state.input3);
  }


  //This event makes the hours goes to the Ta's hoursUsed.
  handleOnBlurInput(uofmID, event) {
    console.log(event.target.value);
    console.log(event.target.id);
    console.log(uofmID);
    this.props.updatingHoursUsed(event.target.id, event.target.value, uofmID);


  }

  render() {

    console.log(this.props);



    const dropDownMenu = (crn, taIndex) => {

      return (this.props.tas.map((ta) => {
        // If the Ta is not available then do not show them as an option for selection.
        if (ta.available === true)  {
        return (<a class="dropdown-item" onClick={this.handleSelectClick.bind(this, ta.lastName, crn, taIndex, ta.UofMID)}>{ta.firstName + " " + ta.lastName}</a>);
        }
      })
    );
    }

    const dropdown = (dropid, dropdownName, crn, taIndex) => {


      let dropdownId = dropdownName + "dropDown" + dropid;
      let dropWrapId = dropdownName + "dropDownWrap" + dropid;
      let dropMenuId = dropdownName + "dropDownMenu" + dropid;

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
            onClick={this.handleDropdownClick.bind(this, dropdownId, dropWrapId, dropMenuId)}>
              {dropdownName}
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" id={dropMenuId}>
              {dropDownMenu(crn, taIndex)}
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
    const courseMap = this.props.courses.map((row, id) => {

      id += 3;
      return(
      <Row>
        <Col><button class="btn btn-primary btn-round" type="button" id={row.crn} onClick={this.courseClick.bind(this, row.crn)}>{row.courseName}</button></Col>
        <Col><label>{row.TAHOURSNeeded}</label></Col>
        <Col><Row>{dropdown(id, row.CourseTA[0], row.crn, 0,)}{makeInput("input" + id, row.TaUofMID[0])}</Row></Col>
        <Col>{dropdown(id+1, row.CourseTA[1], row.crn, 1)}<label><font color="green">Hours</font></label></Col>
        <Col>{dropdown(id+2, row.CourseTA[2], row.crn, 2)}<t/><label><font color="green">Hours</font></label></Col>
      </Row>
    );

    });



    const gaMap = this.props.tas.map((ta) => {
      //If the Ta is not available do not display the Ta
      if(ta.available === true) {
      return (
      <Row>
        <Col><Label className="text-white" id={ta.UofMID}>{ta.firstName + " " + ta.lastName}</Label></Col>
        {/*//This will be used to tell how many more hours the Ta has available*/}
        <Col><label>{ta.HoursAvailable - (parseInt(ta.HoursUsed[0]) + parseInt(ta.HoursUsed[1]) + parseInt(ta.HoursUsed[2]))}</label></Col>
      </Row>
      );
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

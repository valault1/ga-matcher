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
      //Pass the props stuff to state, so it can be changed here instead of in the index
      this.state={
        courseSheet: this.props.courseSheet,
        nameSheet: this.props.nameSheet,
        nameStyler: {color: 'white'}
                  };
    }
  componentDidMount() {


    document.body.classList.toggle("index-page");
    console.log(this.props.nameSheet);
    console.log(this.props.courseSheet);
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



  render() {

    const dropdown = (dropid, dropdownName) => {

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
              <a class="dropdown-item" href="#">{this.props.nameSheet[1]}</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
        </div>
      );
    }

    let id = 0
    const courseMap = this.props.courseSheet.map((row, id) => {

      ++id;
      return(
      <Row>
        <Col><label onClick={this.handleclick}>{row[1]}</label></Col>
        <Col><label>{row[4]}</label></Col>
        <Col>{dropdown(id, "TA's")}<label><font color="green">Hours</font></label></Col>
        <Col><label>TA 2 </label><t/><label><font color="green">Hours</font></label></Col>
        <Col><label>TA 3 </label><t/><label><font color="green">Hours</font></label></Col>
      </Row>
    );

    });



    const gaMap = this.props.nameSheet.map((row) =>
      <Row>
        <Col><label style={this.state.nameStyler}>{row[1]}</label></Col>
        <Col><label>{row[6]}</label></Col>
      </Row>
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

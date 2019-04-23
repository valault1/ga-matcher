import React from "react";
import { Link } from "react-router-dom";
// reactstrap components

import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

class Navbars extends React.Component {
  constructor(props) {
    super(props);
  }
  downloadFile() {
    try {
      var csvData = this.getCsvData();
    }
    catch {
      console.log("ERROR");
    }



    var FileSaver = require('file-saver');
    var blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
    FileSaver.saveAs(blob, "hello world.csv")
  }
  getCsvData() {
    let csvData="";
    csvData += "First Name, Last Name, U#, Hours Assigned, Course 1 CRN,Course 1 Hours Assigned, Course 1 Name, Course 1 Teacher, Course 1 Days, Course 1 Start,";
    csvData += "Course 2 CRN,Course 2 Hours Assigned, Course 2 Name, Course 2 Teacher, Course 2 Days, Course 2 Hours\n"

    for (let i=0; i < this.props.tas.length; i++) {
      let ta = this.props.tas[i];
      let classes = [];
      for (let j=0; j < ta.inputsUsed.length; j++) {
        if (ta.inputsUsed[j] !== '') {
          classes.push(this.props.courses_dict[ta.inputsUsed[j].slice(7)]);
        }
      }
      
      csvData +=ta.First + ",";
      csvData +=ta.Last + ",";
      csvData +=ta["U#"]+ ",";
      csvData +=ta.HoursAvailable + ",";

      for (let j=0; j < classes.length; j++) {
        csvData += classes[j].CRN + ",";
        csvData += ta.HoursUsed[j] + ",";

        csvData += classes[j]['Subject_Area'] + classes[j]['Course_Number'] + ",";
        csvData += classes[j].Instructor_Last_Name + ",";
        csvData += classes[j].Days + ",";
        csvData += classes[j].Start_Time + " - " + classes[j].Stop_Time + ",";
      }

      csvData +="\n";
      
    }

    


    return csvData;
  }
  render() {
    return (
      <div className="section section-navbars">
        {/* Navbar Info */}
        <Navbar 
        className={"fixed-top default"}
        color="info"
        expand="lg">
          <Container>
            <div className="navbar-translate">
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                University of Memphis CS Dept - GA Matcher
              </NavbarBrand>
              <button className="navbar-toggler" aria-expanded={false}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <Collapse navbar isOpen={false}>
              <Nav className="ml-auto" navbar>
                <NavItem className="active">
                  <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                    <Link to="/upload-page" style={{ color:"white" }}>Upload Excel Sheet</Link>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#pablo" onClick={this.downloadFile.bind(this)}>
                    Download Current Setup
                    
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        {/* End Navbar Info */}
      </div>
    );
  }
}

export default Navbars;

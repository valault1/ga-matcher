import React from "react";
import classnames from "classnames";
// plugin that creates slider
import Slider from "nouislider";
// react plugin used to create switch buttons
import Switch from "react-bootstrap-switch";
import UploadFilePage from "views/examples/UploadFilePage.jsx";
import sheet1 from "views/examples/UploadFilePage.jsx";

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
  TabContent,
  TabPane,
  Card,
  CardHeader,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  CardImg
} from "reactstrap";




class Names extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputFocus: false,
    };
  }

  componentDidMount() {
    
  }
  render() {
   
    var names=[];
    var hours=[];
    for (var i=1; i < this.props.nameSheet.length; i++) {
      names.push(this.props.nameSheet[i][1] + ", " + this.props.nameSheet[i][0]);
      hours.push(this.props.nameSheet[i][6]);
    }
    console.log(this.props.nameSheet + "Logging nameSheet from names");
    var debug=true;
    if (debug) {
      names= ["ShimaShima, Azizzadeh Roodpish",
        "Jeff, Atkinson",
        "Kathryn, Bridson",
        "Keli, Cheng",
        "Saurab, Dulal",
        "Senjuti, Dutta"];
      hours = [5,10,10,20,10,400];
    }


    const namesList = names.map((name) => 
      <p>{name}<br/></p>
    );
    const hoursList = hours.map((hour) => 
      <p>{hour}</p>
    );
    const sheetMap = this.props.nameSheet.map((row) =>
      <Row>
        <Col><label>{row[1]}</label></Col>
        <Col><label>{row[6]}</label></Col>
      </Row>
    );

    return (
      <div className="section section-names" id="basic-elements">
        Potential GA's<br/>
        <Card>
          <CardBody>
            {sheetMap}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Names;

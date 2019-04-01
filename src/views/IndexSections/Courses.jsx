import React from "react";
import classnames from "classnames";
// plugin that creates slider
import Slider from "nouislider";
// react plugin used to create switch buttons
import Switch from "react-bootstrap-switch";

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

class Courses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inputFocus: false
    };
    this.handleclick = this.handleclick.bind(this);
    this.testScript = this.testScript.bind(this);
  }
  testScript() {
    var x = 2;
    for (var i=0; i < 100; i++) {
      x = x + 3;
    }
    alert(x);
  }
  handleclick(event) {
    console.log("You clicked my button!");
  }
  componentDidMount() {

  }



  render() {
    const sheetMap = this.props.courseSheet.map((row) =>
      <Row onClick={this.handleclick()}>
        <Col><td onClick={this.handleclick}>{row[1]}</td></Col>
        <Col><label onClick={this.handleclick}>{row[4]}</label></Col>
        <Col><label>TA 1 </label><label><font color="green">Hours</font></label></Col>
        <Col><label>TA 2 </label><t/><label><font color="green">Hours</font></label></Col>
        <Col><label>TA 3 </label><t/><label><font color="green">Hours</font></label></Col>
      </Row>
    );
    return (


      <div className="section section-courses" id="basic-elements">
        COURSES
        <Card onClick={this.handleclick}>
          <CardBody>
            {sheetMap}
          </CardBody>
        </Card>
        <button onClick={this.handleclick()}>TestButton</button>
        <button onClick={this.handleclick}>TestButton2</button>

      </div>
    );
  }
}

export default Courses;

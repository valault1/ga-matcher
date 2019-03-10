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
    this.click = this.click.bind(this);
    this.testScript = this.testScript.bind(this);
  }
  testScript() {
    var x = 2;
    for (var i=0; i < 100; i++) {
      x = x + 3;
    }
    alert(x);
  }
  click() {
    alert("You clicked my button!");
  }
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="section section-courses" id="basic-elements">
        COURSES
        <Card>
          <CardBody>
            This is the list of Courses<br/>
          </CardBody>
        </Card>
        
      </div>
    );
  }
}

export default Courses;

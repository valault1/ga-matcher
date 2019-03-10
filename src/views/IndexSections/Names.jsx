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
      inputFocus: false
    };
  }

  componentDidMount() {
    
  }
  render() {
    var names;
    names=['Val','Hudson'];
    if (!!UploadFilePage.names) {
      this.names = UploadFilePage.names;
    }
    else {
      this.names=['Val','Hudson'];
    }
    
    const listItems = names.map((name) => <li>{name}</li>);

    return (
      <div className="section section-names" id="basic-elements">
        NAMES<br/>
        <Card>
          <CardBody>
            {listItems}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Names;

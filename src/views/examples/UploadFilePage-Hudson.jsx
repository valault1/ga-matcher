import React from 'react';
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";

import classnames from "classnames";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  NavItem,
  NavLink,
  Nav,
  Table,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel
} from "reactstrap";


//core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";

var sheet1, sheet2;

class UploadFilePageHudson extends React.Component {
  constructor(props) {
    super(props);
    {/*this.handleSubmit = this.handleSubmit.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.fileInput = React.creatRef(); */}
  }



  clickFileInput() {
    document.getElementById('file-input-button').click();

  }


  render() {
    return (
        <>
          <ExamplesNavbar />
          <Container className="align-items-center" style={{paddingTop: "20vh"}}>
              <Row>
                <Col className="col-sm align-items-center">

                  <button class="btn btn-primary btn-round" type="button" id="attach" onClick={this.clickFileInput}>
                    <i class="tim-icons icon-attach-87"></i> Attach File
                  </button>
                  <button class="btn btn-primary btn-round" type="button" id="send" onClick={this.handleSubmit}>
                    <i class="tim-icons icon-check-2"></i>
                    Start editing
                  </button>
                </Col>
                <Col className="col-sm align-items-center">
                <form onSubmit={this.handleSubmit}>
                  <label>
                    <h3>Upload file:</h3>
                    <input type="file" id="file-input-button" ref={this.fileInput} />
                  </label>
                  <br />
                  <button type="submit"></button>
                </form>
                </Col>
              </Row>
              <Row className="justify-content-sm-right">
              <Col className="col-sm align-items-center">
              <form onSubmit={this.handleSubmit}>
                <label>
                  <h3>Upload file:</h3>
                  <input type="file" id="file-input-button" ref={this.fileInput} />
                </label>
                <br />
                <button type="submit"></button>
              </form>
              </Col>
              </Row>
          </Container>
          <Footer />
        </>
    );
  }
}

export default UploadFilePageHudson

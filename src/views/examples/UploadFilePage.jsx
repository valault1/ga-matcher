import React from "react";
import * as XLSX from 'xlsx';
import { Link } from "react-router-dom";


import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";



// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";


var sheet1, sheet2;



class UploadFilePage extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.fileInput = React.createRef();
    
    
  }
  handleSubmit(event) {
    event.preventDefault();
    var f = this.fileInput.current.files[0]
    var name = f.name;
    const reader = new FileReader();
    /*evt = on_file_select event */
    reader.onload = (evt) => { 
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const wsname1 = wb.SheetNames[0];
        const ws1 = wb.Sheets[wsname1];
        /* Get second worksheet */
        const wsname2 = wb.SheetNames[1];
        const ws2 = wb.Sheets[wsname2];
        /* Convert array of arrays */
        sheet1 = XLSX.utils.sheet_to_json(ws1, {header:1});
        sheet2 = XLSX.utils.sheet_to_json(ws2, {header:1});
        var courses=[], names=[];
        for(var i=1; i < sheet1.length; i++) {
          courses.push(sheet1[i][2]);
        }
        for(var i=1; i < sheet2.length; i++) {
          names.push(sheet2[i][1]);
        }
        /* Update state */
        console.log("courses: " + courses);
        console.log("names: " + names);
        document.getElementById('home-link').click();
    };
    reader.readAsBinaryString(f);
    console.log("File processed");
  }


  clickFileInput() {
    document.getElementById('file-input-button').click();

  }

  
  render() {
    return (
      <>

      <h1>This is the upload page.</h1><br/>
      
      <button class="btn btn-info btn-round" type="button" id="attach" onClick={this.clickFileInput}>
        <i class="tim-icons icon-attach-87"></i> Attach File
      </button>
      <Link to="/home" id='home-link'/>
        <button class="btn btn-info btn-round" type="button" id="send" onClick={this.handleSubmit}>
          <i class="tim-icons icon-check-2"></i> 
          Start editing
          
        </button>
      
      
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" id="file-input-button" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit"></button>
      </form>
      </>
    );
  }
}

export default UploadFilePage;

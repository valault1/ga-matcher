import React from "react";
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
                Info Color
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
                    Discover
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                    Settings
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

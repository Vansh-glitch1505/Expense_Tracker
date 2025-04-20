import 'bootstrap/dist/css/bootstrap.css'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function Head() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#ED8200" }}>
      <Container>
        <Navbar.Brand href="#home" style={{ color: "white" }}>E-Wallet</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" style={{ color: "white" }}>Home</Nav.Link>
            <Nav.Link href="#features" style={{ color: "white" }}>Features</Nav.Link>
            <Nav.Link href="#pricing" style={{ color: "white" }}>Pricing</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Head;
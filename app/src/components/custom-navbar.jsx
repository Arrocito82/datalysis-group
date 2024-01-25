import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function CustomNavbar() {
  return (
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/departments">Departments</Nav.Link>
            <Nav.Link href="/jobs">Jobs</Nav.Link>
            <Nav.Link href="/hired-employees">Hired employees</Nav.Link>
            <Nav.Link href="/reporte1">Hired employees by department</Nav.Link>
            <Nav.Link href="/reporte2">Top hired employees across departments</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default CustomNavbar;
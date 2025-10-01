
import { Container, Form, Navbar, Row, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate()

    const onSubmit = async () => {
        navigate("/CreateTicket")
    }

    return (
        <div className="page-background d-flex flex-column min-vh-100 text-black">
            <Navbar expand="lg" style={{ backgroundColor: '#80E6FF' }}>
                <Container>
                    <Navbar.Brand className="fs-4 fw-bold" href="/">TaskAnchor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </Container>
            </Navbar>              
            <Container className="flex-grow-1 mt-3">
                <Form onSubmit={onSubmit}>
                <Row>
                    <div className="my-4 pb-2 border-bottom">
                    <h1>User Dashboard</h1>
                    </div>
                </Row>
                <Button className="mt-3 mx-3" variant="primary" type="button" onClick={onSubmit}>
                    Open New Ticket
                </Button> 
                </Form>  
            </Container>
    </div>);    

  

}

export default Dashboard;
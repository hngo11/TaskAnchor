import { Container, ListGroup, Form, Navbar, Col, Row, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

function TicketDetails() {

    const baseURL = "http://localhost:3000/api/view/"

    const navigate = useNavigate()

    const [ticket, setTicket] = useState()
    const [loading, setLoading] = useState(true)
    const {ticketID} = useParams()

    const token = localStorage.getItem("token");


    useEffect(()=>{

        console.log(baseURL+ticketID)

        const getTicket = async ()=>{
            try{
                const response = await fetch(baseURL+ticketID)
                const data = await response.json()
                setTicket(JSON.parse(data.ticketData))
                
            }
            catch(err){console.log(err)}
            finally{
                setLoading(false)
            }

        }
        getTicket()
    },[])

    useEffect(()=>{
        console.log(loading)
        console.log(ticket)
        console.log(ticketID)
    },[loading])

    //The return page elements themselves. All bootstrap.
    return ( <>
        {loading?(
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
             </Container>):
            (
                       
            <div className="d-flex flex-column min-vh-100">
            <Navbar expand="lg" style={{ backgroundColor: '#80E6FF' }}>
                <Container>
                    <Navbar.Brand className="fs-4 fw-bold" href="/">TaskAnchor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </Container>
            </Navbar>
            <Container className="flex-grow-1 mt-5" >
            <Row>
            <Container className="d-flex mb-3 justify-content-end">
                <Button className="btn-outline-primary" variant="secondary" type="button" onClick={()=>navigate(`/Dashboard`)}>
                    Return to Dashboard
                </Button> 
            </Container>
            <Container className="d-flex mb-3 justify-content-end">
                <Button  variant="primary" type="button" onClick={()=>navigate(`/Resolve/${ticket._id}`)}>
                    Resolve
                </Button>
            </Container>
            </Row>
            <div className="my-1">
                <h2>Issue Details</h2>
            </div>                              
                <Col>
                <Row>
                    <Col>
                        <Form.Group className=" mb-3 w-25" controlId="name">
                        <Form.Label>Issue Name</Form.Label>
                        <Form.Control
                            type="text" 
                            placeholder={ticket.title}
                            disabled />  
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className=" mb-3 w-25" controlId="name">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={ticket.status}
                            disabled />  
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3 w-50">
                     <Col>
                        <Form.Group controlId="name">
                        <Form.Label>Assigned to:</Form.Label>
                        <Form.Control
                            type="text" 
                            placeholder={ticket.assigned}
                            disabled />  
                        </Form.Group></Col>
                    <Col>
                        <Button className="mt-4 w-50" variant="primary" type="button" onClick={()=>navigate(`/Assign/${ticket._id}`)}>
                            Reassign
                        </Button>
                     </Col>
                </Row>
                <Row>
                    <Form.Group className=" mb-3 w-50" controlId="name">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder={ticket.description}
                    disabled />  
                    </Form.Group>
                </Row>
                </Col>
                <Col>

                </Col>
                 <br/><br/>
                <div className="my-1">
                    <h3>Logs</h3>
                </div>
                <Row>
                    <ListGroup className="py-0">
                        {ticket.logs.map((item,index) => (
                        <ListGroup.Item className="py-0" key={index}>
                            {item}
                        </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Row>
                <Row>
                    <Container className="d-flex mb-3">
                        <Button className="d-flex mt-3 mx-3 " variant="primary" type="button" onClick={()=>navigate(`/Log/${ticket._id}`)}>
                            Add Log
                        </Button> 
                    </Container>  
                </Row>
            </Container>
            <br/><br/><br/><br/><br/>
        </div>)}  
    </>)     
}

export default TicketDetails;
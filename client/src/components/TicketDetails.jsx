import { Container, ListGroup, Form, Col, Row, Button, Spinner, Card } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

function TicketDetails() {

    const ticketURL = "http://localhost:3000/api/view/"
    const userURL = "http://localhost:3000/api/users/"

    const navigate = useNavigate()

    const [user, setUser] = useState({});
    const [ticket, setTicket] = useState()
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)
    const {ticketID} = useParams()

    const token = localStorage.getItem("token");
    
    useEffect(()=>{

        let userID = ""
        
        if(token && token != "undefined"){
            userID = jwtDecode(token).id
        }

        const getUser = async ()=>{
            try{
                const response = await fetch(userURL+userID)
                const data = await response.json()
                setUser(JSON.parse(data.userData))
            }
            catch(err){console.log(err)}
             finally{
                setFirstLoading(false)
            }
        }
        getUser()
      
    },[])

    useEffect(()=>{

        console.log(ticketURL+ticketID)

        const getTicket = async ()=>{
            try{
                const response = await fetch(ticketURL+ticketID)
                const data = await response.json()
                setTicket(JSON.parse(data.ticketData))
            }
            catch(err){console.log(err)}
            finally{
                setSecondLoading(false)
            }
        }
        getTicket()

    },[firstLoading])
  

    useEffect(()=>{
        console.log(firstLoading)
        console.log(user)
        console.log(secondLoading)
        console.log(ticket)
        console.log(ticketID)
    },[secondLoading])


    //The return page elements themselves. All bootstrap.
    return ( <>
        {(firstLoading || secondLoading)?(
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
             </Container>):
            (          
            <div className="page-background d-flex flex-column min-vh-100">
                <NavBar/>
                <Container className="flex-grow-1 mt-5" >
                    <div className="my-1 border-bottom">
                        <h2>Ticket Details</h2>
                    </div>
                    <br/><br/>                          
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="name">
                                        <Form.Label>Issue Name</Form.Label>
                                        <Form.Control
                                            type="text" 
                                            placeholder={ticket.title}
                                            disabled />  
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mx-5 w-50" controlId="status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={ticket.status}
                                            disabled />  
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="creationdate">
                                        <Form.Label>Date Created</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={ticket.creationDate}
                                            disabled />  
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="Assigned">
                                    <Form.Label>Assigned to:</Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder={ticket.assigned}
                                        disabled />  
                                    </Form.Group>
                                </Col>
                                <Col className="mt-auto" md={5}>
                                    {(user.isAdmin || (ticket.assigned===jwtDecode(token).user)) &&
                                    <Container className="d-flex justify-content-start">
                                        <Button variant="primary" type="button" disabled={ticket.status==="Resolved"} onClick={()=>navigate(`/Assign/${ticket._id}`)}>
                                            Reassign
                                        </Button>
                                    </Container>
                                    }
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="resolutiondate">
                                        <Form.Label>Resolved Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={ticket.resolutionDate}
                                            disabled />  
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br/><br/>
                            <Row>
                                <Form.Group controlId="Description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={8}
                                    placeholder={ticket.description}
                                    disabled />  
                                </Form.Group>
                            </Row>
                            <br/><br/>
                            <div className="my-1 border-bottom">
                                <h3>Logs</h3>
                            </div>
                            <br/>
                            <Row>
                                <Container className="d-flex mb-3">
                                    <Button className="d-flex mt-3 mx-3 " variant="primary" type="button" onClick={()=>navigate(`/Log/${ticket._id}`)}>
                                        Add to Log
                                    </Button> 
                                </Container>  
                            </Row>                             
                            <Row>
                                <Card> 
                                    <Card.Header className="bg-transparent">
                                        Action: Reassigment
                                        <br/>
                                        Performed by: [Test]
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text className="text-decoration-underline">
                                            Details
                                        </Card.Text>
                                        <Card.Text>
                                            Ticket reassigned to: [Steve]
                                            <br/><br/>
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>Time: [Sat Nov 01 2025 02:55:06 GMT-0400 (Eastern Daylight Time)]</Card.Footer>
                                </Card>
                                <ListGroup className="py-0 w-75">
                                    {ticket.logs.map((item,index) => (
                                    <ListGroup.Item key={index}>
                                        {item}
                                    </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row className="d-flex ms-auto w-75">
                                <Button variant="primary" type="button" onClick={()=>navigate(`/Dashboard`)}>
                                    Return to Dashboard
                                </Button>
                            </Row>
                            <br/>
                            <Row className="d-flex ms-auto w-75">
                                <Button  variant="primary" type="button" disabled={!(user.isAdmin || (ticket.assigned===jwtDecode(token).user))||ticket.status==="Resolved"} onClick={()=>navigate(`/Resolve/${ticket._id}`)}>
                                    Resolve Ticket
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
            </div>)}  
    </>)     
}

export default TicketDetails;
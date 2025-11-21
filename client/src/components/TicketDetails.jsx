import { Container, Form, Col, Row, Button, Spinner, Card } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import LogCard from './LogCard.jsx';


function TicketDetails() {

    const ticketURL = "http://localhost:3000/api/view/"
    const userURL = "http://localhost:3000/api/user"
    const updateURL = "http://localhost:3000/api/update/"

    const navigate = useNavigate()

    const [user, setUser] = useState({});
    const [ticket, setTicket] = useState()
    const [loading, setLoading] = useState(true)
    const {ticketID} = useParams()

    const token = sessionStorage.getItem("token")

    
    useEffect(()=>{

        if(!token || token == "undefined"){
            navigate('/')
        }

       const getUser = async ()=>{
            try{
                const response = await fetch(userURL,{
                    headers:{
                        "authorization": `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setUser(JSON.parse(data.userData))
            }
            catch(err){console.log(err)}
        }
        getUser()
      
    },[])

    useEffect(()=>{

        console.log(ticketURL+ticketID)

        const getTicket = async ()=>{
            try{
                const response = await fetch(ticketURL+ticketID,{
                    headers:{
                        "authorization": `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setTicket(JSON.parse(data.ticketData))
            }
            catch(err){console.log(err)}
            finally{
                setLoading(false)
            }
        }
        getTicket()

    },[user])
  
    useEffect(()=>{
        console.log(loading)
        console.log(user)
        console.log(ticket)
    },[loading])

    const handleReopen = async () => {

        const author = user.username
        const status = "In Progress"
        const action = "Reopen Ticket"
        const comment = "Ticket was Reopened"
        const date = new Date().toString()
        const resolutionDate = ""
        const log = {action,author,comment,date}
        const logs = [...ticket.logs,log]

        try {  
            const response = await fetch(updateURL+ticketID, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`},
            body: JSON.stringify({resolutionDate,logs,status}),
            });
            const data = await response.json()
            if(response.ok){
                window.location.reload();
            }
            else{
            alert(data.msg || "Update unsuccessful")
            }
        }
        catch(err){console.log(err)}
  }


    return ( <>
        {(loading)?(
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
                    <br/>                          
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="name">
                                        <Form.Label>Issue Name</Form.Label>
                                        <Form.Control
                                            type="text" 
                                            placeholder={ticket.title}
                                            readOnly = {ticket.status != "Resolved"}
                                            disabled = {ticket.status == "Resolved"} />  
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mx-5 w-50" controlId="status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={ticket.status}
                                            readOnly = {ticket.status != "Resolved"}
                                            disabled = {ticket.status == "Resolved"} />  
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="creationdate" >
                                        <Form.Label>Date Created</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={ticket.creationDate}
                                            readOnly = {ticket.status != "Resolved"}
                                            disabled = {ticket.status == "Resolved"} />  
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md={3} className="my-2">
                                    <Form.Group controlId="Assigned">
                                        <Form.Label>Assigned to:</Form.Label>
                                        <Form.Control
                                            type="text" 
                                            placeholder={ticket.assigned}
                                            readOnly = {ticket.status != "Resolved"}
                                            disabled = {ticket.status == "Resolved"} />  
                                    </Form.Group>
                                </Col>
                                <Col className="mt-auto my-2" md={5}>
                                    {(user.isAdmin || (ticket.assigned===user.username)) &&
                                        <Container className="d-flex justify-content-start">
                                            <Button variant="primary" type="button" disabled={ticket.status==="Resolved"} onClick={()=>navigate(`/ticketdetails/assign/${ticket._id}`)}>
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
                                            readOnly = {ticket.status != "Resolved"}
                                            disabled = {ticket.status == "Resolved"} />  
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Form.Group controlId="Description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={8}
                                    placeholder={ticket.description}
                                    readOnly = {ticket.status != "Resolved"}
                                    disabled = {ticket.status == "Resolved"} />  
                                </Form.Group>
                            </Row>
                            <br/><br/>
                            <div className="my-1 border-bottom">
                                <h3>Logs</h3>
                            </div>
                            <br/>
                            <Row>
                                <Container className="d-flex mb-3">
                                    <Button className="d-flex" variant="primary" type="button" onClick={()=>navigate(`/ticketdetails/log/${ticket._id}`)}>
                                        Add to Log
                                    </Button> 
                                </Container>  
                            </Row>                             
                            <Row>
                                <Container className="logs">
                                    {ticket.logs.map((item,index) => (
                                        <LogCard
                                            log={item}
                                            key={index}
                                        />
                                    ))}
                                </Container>
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
                                <Button  variant="primary" type="button" disabled={!(user.isAdmin || (ticket.assigned===user.username))||ticket.status==="Resolved"} onClick={()=>navigate(`/ticketdetails/resolve/${ticket._id}`)}>
                                    Resolve Ticket
                                </Button>
                            </Row>
                            <br/>
                            <Row className="d-flex ms-auto w-75">
                                {user.isAdmin &&
                                    <Button  variant="primary" type="button" disabled={ticket.status!="Resolved"} onClick={handleReopen}>
                                        Reopen Ticket
                                    </Button>
                                }
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
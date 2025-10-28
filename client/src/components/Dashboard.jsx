
import { Container, Form, Navbar, Row, Button, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true)
    const ticketsURL = "http://localhost:3000/api/alltickets"
    const navigate = useNavigate()

    const onSubmit = async () => {
        navigate("/CreateTicket")
    }

    useEffect(()=>{

        const getTickets = async ()=>{
            try{
                const response = await fetch(ticketsURL)
                const data = await response.json()
                setTickets(data)
        
            }
            catch(err){console.log(err)}
            finally{
                setLoading(false)
            }
        }
        getTickets()
        console.log(tickets)
    },[])


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
                <Container className="d-flex mb-3 justify-content-end">
                <Button className="d-flex mt-3 mx-3 " variant="primary" type="button" onClick={onSubmit}>
                    Open New Ticket
                </Button> 
                </Container>
                <br/><br/><br/>
                </Form>
                <div className="my-1">
                    <h2>All Tickets</h2>
                </div>
        <Table responsive="sm" className="border border-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Discription</th>
            <th>Creation Date</th>
            <th>Assigned</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            {tickets.map((ticket) => (
                <tr key={tickets._id}>
                    <td className="w-25" onClick={()=>navigate(`/View/${ticket._id}`)}>{ticket.title}</td>
                    <td className="w-25">{ticket.description}</td>
                    <td>{ticket.date}</td>
                    <td>{ticket.assigned}</td>
                    <td>{ticket.status}</td>
                </tr>
                ))}
          </tbody>
          </Table>
            <br/><br/><br/>
                 <div className="my-1">
                    <h2>My Tickets</h2>
                </div>
        <Table responsive="sm" className="border border-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Discription</th>
            <th>Creation Date</th>
            <th>Assigned</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
            {tickets.map((ticket) => (
                    <tr key={tickets._id}>
                        <td className="w-25">{ticket.title}</td>
                        <td className="w-25">{ticket.description}</td>
                        <td>{ticket.date}</td>
                        <td>{ticket.assigned}</td>
                        <td>{ticket.status}</td>
                    </tr>
                    ))}
          </tbody>
          </Table>
            </Container>
           
    </div>);    

  

}

export default Dashboard;
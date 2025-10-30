import { Container, Form, Navbar, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Assign() {

  const ticketURL = "http://localhost:3000/api/view/"
  const updateURL = "http://localhost:3000/api/update/"
  const userURL = "http://localhost:3000/api/allusers"
  
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [assigned, setAssigned] = useState("")
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState()
  const {ticketID} = useParams()
  
   const token = localStorage.getItem("token");

  const onCancel = async () => {
        navigate(-1)
  }

    useEffect(()=>{

        const getUsers = async ()=>{
            try{
                const response = await fetch(userURL)
                const users = await response.json()
                setUsers(users)
                
            }
        catch(err){console.log(err)}
        }
        getUsers()

        console.log(ticketURL+ticketID)

        const getTicket = async ()=>{
            try{
                const response = await fetch(ticketURL+ticketID)
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

   const onSubmit = async () => {
    
    let status = "In Progress"

    try {  
        const response = await fetch(updateURL+ticketID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({assigned, status}),
      });
        const data = await response.json()
        if(response.ok){
          navigate(-1)
        }
        else{
          alert(data.msg || "Update unsuccessful")
        }
      }
      catch(err){console.log(err)}
  }



    return ( <>
    {loading?(
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            </Container>):
        (                    
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
                <h1>Reassign Case</h1>
                </div>
            </Row>
                    <Form.Group className=" mb-3 w-25" controlId="name">
                        <Form.Label> Currently Assigned:</Form.Label>
                        <Form.Control
                            type="text" 
                            placeholder={ticket.assigned}
                            disabled />  
                    </Form.Group>                
            <Row>
              <Form.Group className=" mb-3 w-25" controlId="assign">
                    <Form.Label>Reassign to</Form.Label>
                    <Form.Select
                        value={assigned} 
                        onChange={(e)=>setAssigned(e.target.value)}
                        aria-label="Default select example">
                        <option></option>
                            {users.map((user) => (
                            <option key={user._id} value={user.email}>
                                {user.email}
                            </option>
                        ))} 
                    </Form.Select>         
              </Form.Group>
            </Row>
            <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
            <Button className="mt-3 mx-3" variant="primary" type="button" onClick={onSubmit}>
                Save Changes
            </Button> 
            </Form>  
        </Container>
    </div>)}  
    </>)     
}

export default Assign;
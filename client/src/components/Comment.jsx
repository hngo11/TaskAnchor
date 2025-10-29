import { Container, Form, Navbar, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Comment() {

  const ticketURL = "http://localhost:3000/api/view/"
  const updateURL = "http://localhost:3000/api/update/"
  
const navigate = useNavigate()


  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState()
  const [log, setLog] = useState("")
  const {ticketID} = useParams()
  

  
  const onCancel = async () => {
        navigate(-1)
  }
    
   useEffect(()=>{

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

   const onSubmit = async () => {
    
    let status = "In Progress"

    const logs = [...ticket.logs,log]

    try {  
        const response = await fetch(updateURL+ticketID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({logs, status}),
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


    return (<>
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
                <h1>Update Log</h1>
                </div>
            </Row>
                  
            <Row>  
                <Form.Group className="mb-3" controlId="info">
                    <Form.Label>Add Comment</Form.Label>
                    <Form.Control
                    required
                    className='border border-dark border-1'
                    as="textarea"
                    rows={4} 
                    value={log}
                    onChange={(e)=>setLog(e.target.value)}
                    placeholder="Comment Here..."/>
                    <Form.Control.Feedback type="invalid">
                        Cannot be empty.
                    </Form.Control.Feedback>            
                </Form.Group>       
            </Row>
            <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
            <Button className="mt-3 mx-3" variant="primary" type="button" onClick={onSubmit}>
                Update
            </Button> 
            </Form>  
        </Container>
    </div>)}  
    </>)   

}

export default Comment;
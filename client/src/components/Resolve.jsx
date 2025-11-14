import { Container, Form, Navbar, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

function ResolveTicket() {

    const ticketURL = "http://localhost:3000/api/view/"
    const updateURL = "http://localhost:3000/api/update/"

    const navigate = useNavigate()

    const [ticket, setTicket] = useState()
    const [log, setLog] = useState("")
    const [loading, setLoading] = useState(true)
    const {ticketID} = useParams()

    const token = localStorage.getItem("token")
  

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

        let author = "Unknown"    

        if(token && token != "undefined"){
                author = jwtDecode(token).user
        }

        const status = "Resolved"
        const action = "Resolution"
        const comment = "Issue was resolved.\n\nTicket closed."
        const resolutionDate = new Date().toString()
        const date = resolutionDate
        const log = {action,author,comment,date}
        const logs = [...ticket.logs,log]

    try {  
        const response = await fetch(updateURL+ticketID, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({resolutionDate,logs,status}),
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
                <NavBar/>
                <Container className="flex-grow-1 mt-3">
                    <div className="my-4 pb-2 border-bottom">
                        <h1>Ticket Resolution</h1>
                    </div>
                    <br/>
                    <Form onSubmit={onSubmit}>    
                        <Row>  
                            <Form.Group className="w-50" controlId="Comment">
                                <Form.Label>Resolution</Form.Label>
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
                        <br/>
                        <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button className="mt-3 mx-3" variant="primary" type="button" onClick={onSubmit}>
                            Close Ticket
                        </Button> 
                    </Form>  
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
        </div>)}  
    </>)   

}

export default ResolveTicket;
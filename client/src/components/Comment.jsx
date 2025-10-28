import { Container, Form, Navbar, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Comment() {

const baseURL = "http://localhost:3000/api/view/"
  
const navigate = useNavigate()

  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState()
  const {ticketID} = useParams()
  

  
  const onCancel = async () => {
        navigate(-1)
  }

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



   const onSubmit = async () => {
    
     let date = new Date().toString()
     let status = "New"
     let logs = []
     let author = "Unknown"

     const token = localStorage.getItem("token")
    if(token != null){
       author = jwtDecode(token).user
        console.log(author)
     }

     if (assigned == null)
        console.log(assigned)
        setAssigned(author)

     try{
        let response = await fetch(URL,{
          method:"POST",
          headers:{
              "content-type":"application/json"
          },
          body:JSON.stringify({title, author, date, assigned, status, description,logs})
        })
        const data = await response.json()
        if(response.ok){
          navigate("/Dashboard")
        }
        else{
          alert(data.msg || "Issue Creation failed!")
        }
      }
      catch(err)
      {
        console.log(err)
      }
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
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
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
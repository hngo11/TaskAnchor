
import { Container, Form, Navbar, Row, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function CreateTicket() {

  const URL = "http://localhost:3000/api/createTicket"
  const userURL = "http://localhost:3000/api/allusers"
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [assigned, setAssigned] = useState("")

  
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
        finally{
            setLoading(false)
        }
    }
    getUsers()
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
                <h1>Open New Ticket</h1>
                </div>
            </Row>
            <Row>
                <Form.Group className=" mb-3 w-50" controlId="name">
                    <Form.Label>Issue Name</Form.Label>
                    <Form.Control
                    required
                    className='border border-dark border-1'
                    type="text" 
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="Subject"/>
                    <Form.Control.Feedback type="invalid">
                        Cannot be empty.
                    </Form.Control.Feedback>                   
                </Form.Group>
            </Row>
            <Row>
              <Form.Group className=" mb-3 mx-3 w-25" controlId="assign">
                    <Form.Label>Assign to</Form.Label>
                <Row>
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
                </Row>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3 w-75" controlId="info">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                    required
                    className='border border-dark border-1'
                    as="textarea"
                    rows={4} 
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder="Provide a Brief Description"/>
                    <Form.Control.Feedback type="invalid">
                        Cannot be empty.
                    </Form.Control.Feedback>            
                </Form.Group>  
            </Row>
            <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
            <Button className="mt-3 mx-3" variant="primary" type="button" onClick={onSubmit}>
                Submit
            </Button> 
            </Form>  
        </Container>
    </div>);

}

export default CreateTicket;
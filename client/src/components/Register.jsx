
import { Container, Navbar, Form, Row, Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

    const URL = "http://localhost:3000/api/auth/register"

    const navigate = useNavigate()

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [validated, setValidated] = useState(false)
    
    const onsubmit = async (event)=>{


        const form = event.currentTarget;
        console.log(form.checkValidity())
        if (form.checkValidity() === false) {
        
        event.preventDefault();
        event.stopPropagation();
        }
        else {
            setValidated(true);
            try{
                let response = await fetch(URL,{
                    method:"POST",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({username,email,password})
                })
                const data = await response.json()
                
                const token = data.token
                if(response.ok && token){
                    localStorage.setItem("token",token)
                    navigate("/Dashboard")
                }
                else{
                    alert(data.msg || "Registration failed!")
                }
            }
            catch(err){console.log(err)}
        } 
    }

    const oncancel = async (event) => {
        navigate(-1)
    }


    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar expand="lg" style={{ backgroundColor:'#80E6FF' }}>
                <Container>
                    <Navbar.Brand className="fs-4 fw-bold" href="/">TaskAnchor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </Container>
            </Navbar>
            <Container  className = "container d-flex justify-content-center align-items-center mt-5" fluid>
                <Card className="text-center"  style={{ width: '20rem' }}>
                    <Card.Header className="fs-5 fw-bold" style={{ backgroundColor: '#80E6FF' }}>New Account Registration</Card.Header>
                    <Card.Body>
                        <Container >
                            <Form noValidate validated={validated} onSubmit={onsubmit}>
                                <Form.Group  as={Row} className="mb-3" controlId="formGridUsername">
                                    <Form.Label>Create a Username</Form.Label>
                                    <Form.Control
                                        required
                                        className='border border-dark border-1'
                                        type="text" 
                                        value={username}  
                                        onChange={(e)=>setUsername(e.target.value)}
                                        placeholder="e.g. Employee111" />
                                    <Form.Control.Feedback type="invalid">
                                        Cannot be empty.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formGridEmail">
                                    <Form.Label>Enter your Email</Form.Label>
                                    <Form.Control
                                        required
                                        className='border border-dark border-1'
                                        type="email" 
                                        value={email} 
                                        onChange={(e)=>setEmail(e.target.value)}
                                        placeholder="e.g. Bob.Smith@team.com" />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formGridPassword">
                                    <Form.Label>Create a Password</Form.Label>
                                    <Form.Control
                                        required
                                        className='border border-dark border-1'
                                        type="password" 
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                        placeholder="Create Your Password" />
                                    <Form.Control.Feedback type="invalid">
                                    Please enter a valid password.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button className="mt-3" variant="primary" type="button" onClick={onsubmit}>
                                    Submit
                                </Button>
                                <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={oncancel}>
                                    Cancel
                                </Button>
                            </Form>
                        </Container>
                    </Card.Body>
                </Card>
            </Container>
    </div>);
}

export default Register;


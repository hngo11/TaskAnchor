import { Container, Form, Navbar, Nav, Col, Row, Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/anchor-svgrepo-com.svg"


function Login() {

	const URL = "http://localhost:3000/api/auth/login"

    const navigate = useNavigate()

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [validated, setValidated] = useState(false)
    

    const onSubmit = async (event)=>{
      
		const form = event.currentTarget;
		
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
					body:JSON.stringify({username,password})
				})
				const data = await response.json()
				
				const token = data.token
				if(response.ok && token) {
					localStorage.setItem("token",token)
					navigate("/Dashboard")
				}
				else{
					alert(data.msg || "Login failed!")
				}
			} 
			catch(err){
				console.log(err)
			}
		} 
    }


    return (
		<div className="page-background d-flex flex-column min-vh-100">
			<Navbar expand="lg" style={{ backgroundColor: '#80E6FF' }}>
			<Container>
				<Navbar.Brand className="fs-4 fw-bold" href="/">
					<img 
						src={Logo}
						alt=""
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>{' '}
					TaskAnchor
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
			</Container>
			</Navbar>
			<Container className = "container d-flex justify-content-center align-items-center mt-5">
				<Card className="text-center" style={{ width: '20rem' }}>
					<Card.Header className="fs-4 fw-bold" style={{ backgroundColor: '#80E6FF' }} >Account Login</Card.Header>
					<Card.Body>
						<Container>
							<Form noValidate validated={validated} onSubmit={onsubmit}>
								<Form.Group  as={Row} className="mb-3" controlId="formGridUsername">
								<Form.Label className="text-black">Username</Form.Label>
								<Form.Control 
									required
									className='border border-dark border-1'
									type="text" 
									value={username}  
									onChange={(e)=>setUsername(e.target.value)}
									placeholder="Enter Username" />
								<Form.Control.Feedback type="invalid">
									Cannot be empty.
								</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Row} className="mb-3" controlId="formGridPassword">
								<Form.Label className="text-black">Password</Form.Label>
								<Form.Control
									required
									className='border border-dark border-1'
									type="password" 
									value={password}
									onChange={(e)=>setPassword(e.target.value)}
									placeholder="Enter Password" />
								<Form.Control.Feedback type="invalid">
									Cannot be empty.
								</Form.Control.Feedback>
								</Form.Group>
								<Button className="mt-3" variant="primary" type="button" onClick={onSubmit}>
									Login
								</Button>
								<Nav.Link className="text-black mt-3" href="/Register">Not Signed up? <u>Create Account</u></Nav.Link>
							</Form>
						</Container>
					</Card.Body>
				</Card>
			</Container>
    </div>);

}

export default Login;
import { Container, Form, Row, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

function CreateTicket() {

    const createURL = "http://localhost:3000/api/createTicket"
    const userURL = "http://localhost:3000/api/allusers"

    const navigate = useNavigate()

    const [user, setUser] = useState([])
    const [users, setUsers] = useState([])
    const [title, setTitle] = useState("")
    const [assigned, setAssigned] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(true)
    const [validated, setValidated] = useState(false)

    const token = sessionStorage.getItem("token")


    const onCancel = async () => {
        navigate(-1)
    }

    useEffect(()=>{

        if(token && token != "undefined"){
             setUser(jwtDecode(token))
        }
        else {
            navigate('/')
        }

        const getUsers = async ()=>{
            try{
                const response = await fetch(userURL,{
                    headers:{
                        "authorization": `Bearer ${token}`
                    }
                }) 
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

    const onSubmit = async (event) => {
    
        event.preventDefault();
		event.stopPropagation();

        const form = event.currentTarget;
		
		if (form.checkValidity() === false) {	
            setValidated(true);
		}
        else {

            const author = user.user 
        
            try{
                let response = await fetch(createURL,{
                    method:"POST",
                    headers:{"content-type":"application/json",
                            "authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify({title, author, assigned, description})
                })
                const data = await response.json()
                console.log(response.ok)
                if(response.ok){
                    navigate("/Dashboard")
                }
                else{
                    alert(data.msg || "Issue Creation failed!")
                }
            }
            catch(err)
            {console.log(err)}
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
                <NavBar/>   
                <Container className="flex-grow-1 mt-3">
                    <Form noValidate validated={validated} onSubmit={onSubmit}>
                        <Row>
                            <div className="my-4 pb-2 border-bottom">
                                <h2>New Ticket Creation</h2>
                            </div>
                        </Row>
                        <br/>
                        <Row>
                            <Form.Group className="w-25" controlId="name">
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
                            <Form.Group className="mx-3 w-25" controlId="assign">
                                <Form.Label>Assign to</Form.Label>
                                <Row>
                                    <Form.Select
                                        required
                                        value={assigned} 
                                        onChange={(e)=>setAssigned(e.target.value)}
                                        aria-label="Default select example">
                                            <option></option>
                                            {users.map((user) => (
                                            <option key={user._id} value={user.username}>
                                                {user.username}
                                            </option>
                                            ))} 
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                    Cannot be empty.
                                </Form.Control.Feedback>          
                                </Row>
                            </Form.Group>
                        </Row>
                        <br/><br/><br/>
                        <Row>
                            <Form.Group className="w-50" controlId="info">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    className='border border-dark border-1'
                                    as="textarea"
                                    rows={8} 
                                    value={description}
                                    onChange={(e)=>setDescription(e.target.value)}
                                    placeholder="Provide a Brief Description"/>
                                <Form.Control.Feedback type="invalid">
                                    Cannot be empty.
                                </Form.Control.Feedback>            
                            </Form.Group>  
                        </Row>
                        <br/>
                        <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button className="mt-3 mx-3" type="submit">
                            Submit
                        </Button> 
                    </Form>  
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
        </div>)}  
    </>)   

}

export default CreateTicket;
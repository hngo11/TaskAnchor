import { Container, Form, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

function Assign() {

    const ticketURL = "http://localhost:3000/api/tickets/"
    const updateURL = "http://localhost:3000/api/update/"
    const userURL = "http://localhost:3000/api/allUsers"
    
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [user, setUser] = useState([])
    const [assigned, setAssigned] = useState("")
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)
    const [ticket, setTicket] = useState()
    const [validated, setValidated] = useState(false)
    const {ticketID} = useParams()
    
    const token = sessionStorage.getItem("token")


    const onCancel = async () => {
        navigate(-1)
    }

    useEffect(()=>{

        const checkToken = async ()=>{

            if(!token || token === null){
                sessionStorage.removeItem("token")
                navigate('/') 
            }
            else {
                const decodedToken = jwtDecode(token)
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    sessionStorage.removeItem("token")
                    navigate('/')   
                }
                else {
                    setUser(decodedToken)
                }
            }  
        }
        checkToken()   

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
                setFirstLoading(false)
            }
        }
        getTicket()

     },[])     

    useEffect(()=>{

        const getUsers = async ()=>{
            try{
                const response = await fetch(userURL,{
                    headers:{
                        "authorization": `Bearer ${token}`
                    }
                })
                const users = await response.json()
                const filteredUsers = users.filter(item => item.username !== ticket.assigned)
                setUsers(filteredUsers) 
            }
        catch(err){console.log(err)}
        finally{
                setSecondLoading(false)
        }
        }
        getUsers()
  
    },[firstLoading])

    const onSubmit = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        
        const form = event.currentTarget;
		
		if (form.checkValidity() === false) {	
            setValidated(true);
		}
        else {
    
            const author = user.user
            const status = "In Progress"
            const action = "Reassignment"
            const comment = `Ticket reassigned to: [${assigned}]`
            const date = new Date().toString()
            const log = {action,author,comment,date}
            const logs = [...ticket.logs,log]

            try {  
                const response = await fetch(updateURL+ticketID, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json',
                            "authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({assigned, logs, status}),
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
    }


    return (<>
        {firstLoading || secondLoading?(
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>):
            (                    
            <div className="page-background d-flex flex-column min-vh-100 text-black">
                <NavBar/>
                <br/>
                <Container className="flex-grow-1">
                    <Form noValidate validated={validated} onSubmit={onSubmit}>
                        <Row>
                            <div className="my-4 pb-2 border-bottom">
                                <h2>Reassign Ticket</h2>
                            </div>
                        </Row>
                        <br/>
                        <Row className="d-flex justify-content-center">
                            <Form.Group className=" w-25" controlId="name">
                                <Form.Label> Currently Assigned:</Form.Label>
                                <Form.Control
                                    type="text" 
                                    placeholder={ticket.assigned}
                                    disabled />  
                            </Form.Group>                
                            <Form.Group className="w-25" controlId="assign">
                                <Form.Label>Reassign to</Form.Label>
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
                            </Form.Group>
                        </Row>
                        <br/>
                        <div className="d-flex justify-content-center">          
                            <Button className="mt-3 mx-4 btn-outline-primary" variant="secondary" type="button" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button className="mt-3 mx-3" type="submit">
                                Save Changes
                            </Button>
                        </div>  
                    </Form>  
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
        </div>)}  
    </>)     
}

export default Assign;
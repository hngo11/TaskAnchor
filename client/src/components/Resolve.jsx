import { Container, Form, Row, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

function ResolveTicket() {

    const ticketURL = "http://localhost:3000/api/tickets/"
    const updateURL = "http://localhost:3000/api/update/"

    const navigate = useNavigate()

    const [user, setUser] = useState([])   
    const [ticket, setTicket] = useState()
    const [userComment, setUserComment] = useState("")
    const [loading, setLoading] = useState(true)
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
                setLoading(false)
            }
        }
        getTicket()

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
            const status = "Resolved"
            const action = "Resolution"
            const comment = `${userComment}\n\nTicket closed.`
            const date = new Date().toString()
            const resolutionDate = date
            const log = {action,author,comment,date}
            const logs = [...ticket.logs,log]

        try {  
            const response = await fetch(updateURL+ticketID, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${token}`,
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
                        <h2>Ticket Resolution</h2>
                    </div>
                    <br/>
                    <Form noValidate validated={validated} onSubmit={onSubmit}>    
                        <Row>  
                            <Form.Group className="w-50" controlId="Comment">
                                <Form.Label>Resolution</Form.Label>
                                <Form.Control
                                    required
                                    className='border border-dark border-1'
                                    as="textarea"
                                    rows={4} 
                                    value={userComment}
                                    onChange={(e)=>setUserComment(e.target.value)}
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
                        <Button className="mt-3 mx-3" type="submit">
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
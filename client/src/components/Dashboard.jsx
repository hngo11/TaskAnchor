import { Container, Form, Button, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import './Style.css'

function Dashboard() {
   
    const ticketsURL = "http://localhost:3000/api/alltickets"
    const userURL = "http://localhost:3000/api/users/"

    const navigate = useNavigate()

    const [user, setUser] = useState({});
    const [tickets, setTickets] = useState([]);
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)
    const [filteredList, setFilteredList] = useState([]);

    const onSubmit = async () => {
        navigate("/CreateTicket")
    }

    const token = localStorage.getItem("token")
    
    useEffect(()=>{

        let userID = ""
        
        if(token && token != "undefined"){
            userID = jwtDecode(token).id
        }

        const getUser = async ()=>{
            try{
                const response = await fetch(userURL+userID)
                const data = await response.json()
                setUser(JSON.parse(data.userData))
            }
            catch(err){console.log(err)}
             finally{
                setFirstLoading(false)
            }
        }
        getUser()
      
    },[])

    useEffect(()=>{
      
        const getTickets = async ()=>{
            try{
                const response = await fetch(ticketsURL)
                const data = await response.json()
                setTickets(data)
                
                const filter = data.filter(item =>
                item.assigned.toLowerCase().includes(user.email.toLowerCase()))
                console.log(filter)
                setFilteredList(filter)
            }
            catch(err){console.log(err)}
            finally{
                setSecondLoading(false)
            }
        }
        getTickets()
        
    },[firstLoading])    

    useEffect(()=>{
        console.log(firstLoading)
        console.log(user)
        console.log(secondLoading)
        console.log(tickets)
        console.log(filteredList)
    },[secondLoading])


    return (<>
        {(firstLoading || secondLoading)?(
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
                        <h1>{user.username}'s Dashboard</h1>
                    </div>
                    <Form onSubmit={onSubmit}> 
                        <Container className="d-flex mb-3 justify-content-end">
                            <Button className="d-flex mt-3 mx-3 " variant="primary" type="button" onClick={onSubmit}>
                                Open New Ticket
                            </Button> 
                        </Container>
                    </Form>
                    <br/>
                    <div className="my-1 border-bottom">
                        <h2>All Tickets</h2>
                    </div>
                    <div className="table border border-3">
                    <Table responsive="sm" hover className="table-header pointer">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Creation Date</th>
                                <th>Assigned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket._id} onClick={()=>navigate(`/View/${ticket._id}`)}>
                                    <td className="w-25">{ticket.title}</td>
                                    <td className="w-25">{ticket.description}</td>
                                    <td>{ticket.creationDate }</td>
                                    <td>{ticket.assigned}</td>
                                    <td>{ticket.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                     </div>
                    <br/><br/><br/>
                    {/* <div className="my-1">
                        <h2>My Tickets</h2>
                    </div>
                    <Table responsive="sm" className="border border-3">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Creation Date</th>
                                <th>Assigned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((ticket) => (
                                <tr key={ticket._id}>
                                    <td className="w-25">{ticket.title}</td>
                                    <td className="w-25">{ticket.description}</td>
                                    <td>{ticket.date}</td>
                                    <td>{ticket.assigned}</td>
                                    <td>{ticket.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table> */}
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
        </div>)}      
    </>)   

}

export default Dashboard;
import { Container, Form, Row, Col, Button, Table, Offcanvas, Spinner } from 'react-bootstrap';
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
    const [sortedList, setSortedList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [titleFilter, setTitleFilter] = useState("");
    const [assignedFilter, setAssignedFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [show, setShow] = useState(false);
    const [sort, setSort] = useState("")

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);
    
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
                setFilteredList(data)
                setTableList(data)
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

    const onFilter = async (titleFilt, assignedFilt, statusFilt) => {
        
        let filter = tickets

         if (titleFilt !== '') {
            filter = filter.filter(item =>
                item.title.toLowerCase().includes(titleFilt.toLowerCase()));
        }
        if (assignedFilt !== '') {
            filter = filter.filter(item =>
                item.assigned.toLowerCase().includes(assignedFilt.toLowerCase()));
        }
         if (statusFilt !== '') {
            filter = filter.filter(item =>
                item.status.toLowerCase().includes(statusFilt.toLowerCase()));
        }

        handleClose()
        setTitleFilter(titleFilt)
        setAssignedFilter(assignedFilt)
        setStatusFilter(statusFilt)
        setSort("")
        setFilteredList(filter)
        setTableList(filter)

    }

    const handleSort = async (event) => {
        
        const selection = event.target.value
        let list = filteredList
        console.log(list)

        setSort(selection)

        let sortedList =[];
        let dateObject =""

        switch (selection) {

            case 'Title':
            case 'Assigned':
            case 'Status':
              sortedList = [...list].sort((a, b) => {
                    const valA = a[selection.toLowerCase()];
                    const valB = b[selection.toLowerCase()];
                    return valA.localeCompare(valB)
                })
                return setTableList(sortedList);  
            case 'Date(Newest)':
                dateObject = "creation"+selection.substring(0,4);
                sortedList = [...list].sort((a, b) => {
                    const valA = new Date(a[dateObject]);
                    const valB = new Date(b[dateObject]);
                return valB.getTime() - valA.getTime();
                })
                return setTableList(sortedList);  
            case 'Date(Oldest)':
                dateObject = "creation"+selection.substring(0,4);
                sortedList = [...list].sort((a, b) => {
                    const valA = new Date(a[dateObject]);
                    const valB = new Date(b[dateObject]);
                return valA.getTime() - valB.getTime();
                })
                return setTableList(sortedList);
            default:
                return setTableList(list);
        }
    }


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
                <Row>
                    <div className="my-4 pb-2 border-bottom">
                        <h1>{user.username}'s Dashboard (ID:{user.EmployeeID})</h1>
                    </div>
                </Row>
                <Row>
                    <Container className="d-flex justify-content-end">
                        <Button className="d-flex mx-3" variant="primary" type="button" onClick={onSubmit}>
                            Open New Ticket
                        </Button> 
                    </Container>
                </Row>
                <Row>
                    <Form.Group className=" w-25 mx-3" controlId="Search">
                            <Form.Label> Search Ticket ID:</Form.Label>
                            <Form.Control
                                type="text" 
                                placeholder=""
                                value={titleFilter}
                                onChange={(e)=>{setTitleFilter(e.target.value);onFilter(titleFilter, assignedFilter, statusFilter)}}/>  
                    </Form.Group>  
                </Row>
                <br/>                
                <Row>
                    <Col>
                        <Container className="d-flex align-items-center">
                            <Button variant="primary" onClick={toggleShow} className="me-2">
                                Advanced Filters
                            </Button>
                        </Container>                           
                    </Col>
                    <Col>
                        <Container className="d-flex mb-3 justify-content-end">                   
                            <Form.Group className=" w-25" controlId="SortList">
                                <Form.Label>Sort By</Form.Label>
                                    <Form.Select
                                        value={sort}
                                        onChange={handleSort}
                                        aria-label="Default select example">
                                        <option></option> 
                                        <option>Title</option> 
                                        <option>Date(Newest)</option> 
                                        <option>Date(Oldest)</option>
                                        <option>Assigned</option>
                                        <option>Status</option>
                                    </Form.Select>
                            </Form.Group>
                        </Container>   
                    </Col>                
                </Row>
                    <Offcanvas show={show} onHide={handleClose} scroll={true} backdrop="static">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Filter By;</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Form>
                                <Form.Group className=" w-50" controlId="Title">
                                    <Form.Label> Ticket Title:</Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder=""
                                        value={titleFilter}
                                        onChange={(e)=>setTitleFilter(e.target.value)}/>  
                                </Form.Group>
                                <br/>
                                <Form.Group className=" w-50" controlId="Assigned">
                                    <Form.Label> Currently Assigned:</Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder=""
                                        value={assignedFilter}
                                        onChange={(e)=>setAssignedFilter(e.target.value)}/>  
                                </Form.Group>
                                <Form.Group className=" w-50" controlId="Status">
                                        <Form.Label>Ticket Status</Form.Label>
                                    <Form.Select
                                        value={statusFilter}
                                        onChange={(e)=>setStatusFilter(e.target.value)}
                                        aria-label="Default select example">
                                        <option></option> 
                                        <option>New</option> 
                                        <option>In Progress</option> 
                                        <option>Resolved</option> 
                                    </Form.Select>
                                </Form.Group>  
                                <br/>            
                                <Button variant="primary" onClick={() => onFilter(titleFilter, assignedFilter, statusFilter)}  className="me-2">
                                    Update Search
                                </Button>
                                 <Button variant="tertiary" onClick={() => onFilter("","","")}  className="me-2">
                                    Clear All Filters
                                </Button>
                            </Form>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <div className="border-bottom">
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
                            {tableList.map((ticket) => (
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
                </Container>
                <br/><br/><br/><br/><br/>
                <Footer/>
        </div>)}      
    </>)   

}

export default Dashboard;
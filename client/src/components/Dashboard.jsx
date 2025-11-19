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
    const [loading, setLoading] = useState(true)
    const [filteredList, setFilteredList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [ticketNumFilter, setTicketNumFilter] = useState("");
    const [titleFilter, setTitleFilter] = useState("");
    const [assignedFilter, setAssignedFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filterButton, setFilterButton] = useState(false);
    const [show, setShow] = useState(false);
    const [sort, setSort] = useState("")

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);
    
    const onSubmit = async () => {
        navigate("/CreateTicket")
    }

    const token = sessionStorage.getItem("token")

    
    useEffect(()=>{

        let userID
        
        if(token && token != "undefined"){
            userID = jwtDecode(token).id
        }
        else {
            navigate('/')
        }

        const getUser = async ()=>{
            try{
                const response = await fetch(userURL+userID)
                const data = await response.json()
                setUser(JSON.parse(data.userData))
            }
            catch(err){console.log(err)}
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
                setLoading(false)
            }
        }
        getTickets()

        
    },[user])    

    useEffect(()=>{
        console.log(loading)
        console.log(user)
        console.log(tickets)
        console.log(filteredList)
    },[loading])
    
    useEffect(()=>{

        const FilterList = async () => {
            
            let filter = tickets

            if (ticketNumFilter !== '') {
                filter = filter.filter(item =>
                    item.ticketNumber.toLowerCase().includes(ticketNumFilter.toLowerCase()));
            }        
            if (titleFilter !== '') {
                filter = filter.filter(item =>
                    item.title.toLowerCase().includes(titleFilter.toLowerCase()));
            }
            if (assignedFilter !== '') {
                filter = filter.filter(item =>
                    item.assigned.toLowerCase().includes(assignedFilter.toLowerCase()));
            }
            if (statusFilter !== '') {
                filter = filter.filter(item =>
                    item.status.toLowerCase().includes(statusFilter.toLowerCase()));
            }

            handleClose()
            setSort("")
            setFilterButton(false)
            setFilteredList(filter)
            setTableList(filter)
        }
        FilterList()

    },[ticketNumFilter, filterButton])

    useEffect(()=>{
        
        const SortList = async () => {
        
            let list = filteredList
            console.log(sort)

            let sortedList = [];
            let dateObject = "";
            let selection = "";

            switch (sort) {

                case 'ID (Ascending)':
                    selection = "ticketNumber"
                    sortedList = [...list].sort((a, b) => {
                        const valA = a[selection];
                        const valB = b[selection];
                        return valA.localeCompare(valB)
                    })
                    return setTableList(sortedList);
                case 'ID (Descending)':
                    selection = "ticketNumber"
                    sortedList = [...list].sort((a, b) => {
                        const valA = a[selection];
                        const valB = b[selection];
                        return valB.localeCompare(valA)
                    })
                    return setTableList(sortedList);
                case 'Title':
                case 'Assigned':
                case 'Status':
                sortedList = [...list].sort((a, b) => {
                        const valA = a[sort.toLowerCase()];
                        const valB = b[sort.toLowerCase()];
                        return valA.localeCompare(valB)
                    })
                    return setTableList(sortedList);  
                case 'Date (Newest)':
                    dateObject = "creation"+sort.substring(0,4);
                    console.log(dateObject)
                    sortedList = [...list].sort((a, b) => {
                        const valA = new Date(a[dateObject]);
                        const valB = new Date(b[dateObject]);
                    return valB.getTime() - valA.getTime();
                    })
                    return setTableList(sortedList);  
                case 'Date (Oldest)':
                    dateObject = "creation"+sort.substring(0,4);
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
        SortList()

    },[sort])

    const handleFilter = async () => {
        setFilterButton(true)
    }

    const handleClearFilter = async () => {
        setTicketNumFilter("")
        setTitleFilter("")
        setAssignedFilter("")
        setStatusFilter("")
        setFilterButton(true)
    }


    return (<>
        {(loading)?(
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
                        <h2>{user.username}'s Dashboard (ID:{user.EmployeeID})</h2>
                    </div>
                </Row>
                <Row>
                    <Col>
                    <Form.Group className=" w-50 mx-3" controlId="Search">
                            <Form.Label> Search Ticket ID:</Form.Label>
                            <Form.Control
                                type="text" 
                                placeholder=""
                                value={ticketNumFilter}
                                onChange={(e)=>setTicketNumFilter(e.target.value)}/>  
                    </Form.Group>
                    </Col>
                    <Col className="d-flex align-items-center">
                    <Container className="d-flex justify-content-end align-items-center">
                        <Button variant="primary" type="button" onClick={onSubmit}>
                            Open New Ticket
                        </Button> 
                    </Container>
                    </Col>  
                </Row>
                <br/>                
                <Row>
                    <Col className="d-flex align-items-center">
                        <Container>
                            <Button variant="primary" onClick={toggleShow} className="me-2">
                                Advanced Filters
                            </Button>
                        </Container>                           
                    </Col>
                    <Col className="d-flex align-items-end">
                        <Container className="d-flex justify-content-end">                   
                            <Form.Group className=" w-25" controlId="SortList">
                                <Form.Label>Sort By</Form.Label>
                                    <Form.Select
                                        value={sort}
                                        onChange={(e)=>setSort(e.target.value)}
                                        aria-label="Default select example">
                                        <option></option> 
                                        <option>ID (Ascending)</option>
                                        <option>ID (Descending)</option>
                                        <option>Date (Newest)</option> 
                                        <option>Date (Oldest)</option>
                                        <option>Assigned</option>
                                        <option>Status</option>
                                    </Form.Select>
                            </Form.Group>
                        </Container>   
                    </Col>                
                </Row>
                    <Offcanvas show={show} onHide={handleClose} scroll={true} backdrop="static">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Filter By:</Offcanvas.Title>
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
                                <Button variant="primary" onClick={handleFilter}  className="me-2">
                                    Update Search
                                </Button>
                                 <Button variant="tertiary" onClick={handleClearFilter}  className="me-2">
                                    Clear All Filters
                                </Button>
                            </Form>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <br/>
                    <div className="border-bottom">
                        <h3>All Tickets</h3>
                    </div>
                    <div className="table border border-3">
                    <Table responsive="sm" hover className="table-header pointer">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Creation Date</th>
                                <th>Assigned</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableList.map((ticket) => (
                                <tr key={ticket._id} onClick={()=>navigate(`/ticketdetails/${ticket._id}`)}>
                                    <td className="w-25">{ticket.ticketNumber}</td>
                                    <td className="w-25">{ticket.title}</td>
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
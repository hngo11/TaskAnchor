import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/anchor-svgrepo-com.svg"
import './Style.css'


function NavBar() {

    const navigate = useNavigate()

    const token = sessionStorage.getItem("token")

    const navItems = [
        { label: 'Dashboard', path: '/Dashboard' },
        { label: 'Create Ticket', path: '/CreateTicket' }
    ];

     const onHome = () => {
        if (token) {
            navigate('/Dashboard')
        }
        else {
            navigate('/')
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
    };

    return (
        <Navbar className="navbar" expand="lg">
            <Container>
                <Navbar.Brand className=" navbar pointer fs-4 fw-bold" onClick={onHome}>
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
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto" >
                        {navItems.map((item,index) => (
                            <Nav.Link className="text-black"  key={index}  href={item.path}>
                            {item.label}
                            </Nav.Link>
                        ))}
                        <Nav.Link className="text-black" href={'/'} onClick={logout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>                          
            </Container>
        </Navbar>              
    )
}

export default NavBar;
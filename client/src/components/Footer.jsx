import { Container, Col, Row, } from 'react-bootstrap';

function Footer () {
 
    return (
            
        <div className="mt-auto" style={{ backgroundColor: '#80E6FF' }}>
            <Container className="text-black">
                <Row className = "p-4">
                    <Col className="mx-5 mt-4">
                        <h4>TaskAnchor</h4>
                    </Col>
                    <Col className="mt-2">
                    <h4>Issues? Contact Us!</h4>
                    <p>CaptainPete@TaskAnchor.com</p>
                    <p>Phone: +1(800)TANCHOR</p> 
                    <p>Phone: +1(800)826-2467</p> 
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Footer;
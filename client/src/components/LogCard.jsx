
import { Card } from 'react-bootstrap';


function LogCard ({log}) {
    
    return (
                        
        <Card className="mb-4"> 
            <Card.Header className="bg-transparent">
                Action: {log.action}
                <br/>
                Performed by: [{log.author}]
            </Card.Header>
            <Card.Body>
                <Card.Text className="text-decoration-underline">
                    Details
                </Card.Text>
                <Card.Text>
                    {log.comment}
                    <br/>
                </Card.Text>
            </Card.Body>
            <Card.Footer>Time: [{log.date}]</Card.Footer>
        </Card>)
    }
export default LogCard
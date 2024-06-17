import { Form, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import '../App.css';

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate(); // Update
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  const authenticate = (e) => {
    e.preventDefault();
    const currentEmail = email;
    const currentPassword = password;

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: currentEmail,
        password: currentPassword
      })
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.access !== 'undefined') {
          localStorage.setItem('token', data.access);
          setUser({
            id: data.id,
            isAdmin: data.isAdmin,
          });
          retrieveUserDetails(data.access);

          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Welcome to Online Judge!"
          }).then(() => {
            const redirectPath = new URLSearchParams(location.search).get("redirect");
            navigate(redirectPath || "/"); // Redirect to the problem page or home page if no redirect path is provided
          });
        } else {
          Swal.fire({
            title: "Authentication Failed",
            icon: "error",
            text: "Please check your login details and try again!"
          })
        }
      });

    setEmail('');
    setPassword('');
  };

  const retrieveUserDetails = (token) => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        })
      })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }} >
            <Card>
              <Card.Body className="text-center">
                {(user.id !== null) ? (
                  navigate("/") // Update
                ) : (
                  <Form onSubmit={(e) => authenticate(e)}>
                    <h2>Login</h2>
                    <Form.Group controlId="userEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email here"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password here"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                      />
                    </Form.Group>
                    {
                      isActive ?

                        <Button variant="primary my-3" type="submit" id="submitBtn">Submit</Button>
                        :
                        <Button variant="danger my-3" type="submit" id="submitBtn">Submit</Button>
                    }

                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

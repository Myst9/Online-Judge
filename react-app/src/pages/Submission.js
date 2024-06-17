import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap"; 
import { CodeSlash } from "react-bootstrap-icons";
import UserContext from "../UserContext";

function Submission() {
  const { user } = useContext(UserContext);
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const { problemId } = useParams();

  useEffect(() => {
    console.log(user.id, problemId);
    fetch(`${process.env.REACT_APP_API_URL}/submission/${user.id}/${problemId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch submissions");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched submissions:", data);
        setSubmissions(data);
      })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, [problemId, user.id]);

  const handleShowModal = (code) => {
    setSelectedCode(code);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCode("");
  };

  return (
    <div>
      <h2 style={{ marginTop: "20px" }}>Submissions for Problem {problemId}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Verdict</th>
            <th>Code</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={index}>
              <td>{submission.verdict}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleShowModal(submission.code)}
                >
                 <CodeSlash />
                </Button>
              </td>
              <td>{submission.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{selectedCode}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Submission;

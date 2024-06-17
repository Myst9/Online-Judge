import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useParams } from "react-router-dom";
import "react-resizable/css/styles.css";
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function Problem() {
  const cppTemplate = "#include <iostream>\nusing namespace std;\n\nint main(){\n\n\treturn 0;\n}";
  const [code, setCode] = useState(cppTemplate);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    if (savedCode) {
      setCode(savedCode);
    }
  
    fetch(`${process.env.REACT_APP_API_URL}/problems/${problemId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched problem:", data);
        setProblem(data);
      })
      .catch((error) => {
        console.error("Error fetching problem:", error);
        setProblem(null);
      });
  }, [problemId]);  

  const handleRun = () => {
    const runData = { language: "cpp", code, input };

    fetch(`${process.env.REACT_APP_API_URL}/compiler/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(runData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setOutput(data.output);
        } else {
          setOutput(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setOutput("An unexpected error occurred.");
      });
  };

  const handleSubmit = () => {
    if (!user.id) {
      localStorage.setItem("savedCode", code);
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to submit your solution.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=/problem/${problemId}`);
        }
      });
      return;
    }
  
    const submitData = { language: "cpp", code, problemId, user };

    fetch(`${process.env.REACT_APP_API_URL}/compiler/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(submitData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setOutput(data.verdict);
        } else {
          setOutput(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setOutput("An unexpected error occurred.");
      });
  };

  const handleViewSubmissions = () => {
    navigate(`/submission/${problemId}`);
  };
  
  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    marginRight: "10px",
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginTop: "80px", display: "flex" }}>
      <div style={{ flex: 1, padding: "20px", overflow: "auto", height: "100vh" }}>
        <h4>{problem.name}</h4>
        <p>{problem.problemStatement}</p>
        <h5>Test Cases:</h5>
        <ul>
          {problem.testCases.map((testCase, index) => (
            <li key={index}>
              <div style={{ border: "1px solid #ccc", padding: "5px", marginBottom: "5px" }}>
                <strong>Input:</strong> {testCase.input}
                <br />
                <strong>Output:</strong> {testCase.output}
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleViewSubmissions} style={{ ...buttonStyle, backgroundColor: "#FF9800" }}>
          View Submissions
        </button>
      </div>

      <div style={{ flex: 1, padding: "20px", height:"100%" }}>
        <div style={{ flex: 1 }}>
          <CodeMirror
            value={code}
            height="50vh"
            theme={vscodeDark}
            onChange={(value) => setCode(value)}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleRun} style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}>
            Run
          </button>
          <button onClick={handleSubmit} style={{ ...buttonStyle, backgroundColor: "#2196F3" }}>
            Submit
          </button>
        </div>
        <div style={{ marginTop: "10px", flex: 1, display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your input here"
            style={{ flex: 1, padding: "10px", marginBottom: "10px" }}
          />
          <textarea
            value={output}
            readOnly
            placeholder="Output"
            style={{ flex: 1, padding: "10px", resize: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
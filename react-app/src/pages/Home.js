import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Problem from './Problem';

export default function Home() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = () => {
      fetch(`${process.env.REACT_APP_API_URL}/problems/problem-list`, { withCredentials: true })
        .then(res => res.json())
        .then(data => {
          console.log("Listing problems:", data);

          const problemData = Array.isArray(data) ? data : [data];
		  console.log(problemData)
          setProblems(problemData);
        })
        .catch(error => {
          console.error("Error fetching problems:", error);
          setProblems([]);
        });
    };

    fetchProblems();
  }, []);

  return (
    <div>
      <h3 style={{ marginTop: '80px' }}>Problem List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={index}>
              <td>
                <Link to={`/problem/${problem._id}`}>{problem.name}</Link>
              </td>
              <td>{problem.problemStatement}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

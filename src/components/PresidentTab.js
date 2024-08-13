// PresidentTab.js
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./PresidentTab.css";

function PresidentTab({ setResponseTime, setPresidentData }) {
  const [data, setData] = useState([]);
  const [responseTime, setLocalResponseTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now();

      try {
        const result = await axios.get(
          "https://api-colombia.com/api/v1/President/"
        );
        const end = performance.now();
        setLocalResponseTime(Math.round(end - start));
        if (setResponseTime) {
          setResponseTime(Math.round(end - start));
        }

        if (Array.isArray(result.data)) {
          const groupedData = result.data.reduce((acc, president) => {
            const party = president.politicalParty;
            acc[party] = (acc[party] || 0) + 1;
            return acc;
          }, {});

          const sortedData = Object.entries(groupedData)
            .map(([party, count]) => ({ party, count }))
            .sort((a, b) => b.count - a.count);

          setData(sortedData);
          if (setPresidentData) {
            setPresidentData(sortedData); // Pass the sorted data array to parent component
          }
        } else {
          console.error("Data is not an array:", result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setResponseTime, setPresidentData]);

  const tableRows = useMemo(
    () =>
      data.map((item, index) => (
        <tr key={index}>
          <td>{item.party}</td>
          <td>{item.count}</td>
        </tr>
      )),
    [data]
  );

  return (
    <div>
      <h2>Presidents</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Political Party</th>
              <th>Number of Presidents</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
      <p>Response Time: {responseTime} ms</p>
    </div>
  );
}

export default PresidentTab;

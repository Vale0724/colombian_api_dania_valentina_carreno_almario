import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./TouristicAttractionTab.css"; // Import the specific CSS file if needed

function TouristicAttractionTab({ setResponseTime, setTouristicData }) {
  // State to hold data from API
  const [data, setData] = useState([]);
  // State to hold response time
  const [apiResponseTime, setApiResponseTime] = useState(0);
  // State to handle loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      setLoading(true);
      const start = performance.now(); // Start measuring time

      try {
        // Step 1: Get the list of departments
        const departmentsResponse = await axios.get(
          "https://api-colombia.com/api/v1/Department"
        );
        const departments = departmentsResponse.data;

        // Step 2: Fetch tourist attractions for all departments in parallel
        const attractionsPromises = departments.map(
          (department) =>
            axios
              .get(
                `https://api-colombia.com/api/v1/Department/${department.id}/touristicattractions`
              )
              .then((response) => ({
                department: department.name,
                attractions: response.data,
              }))
              .catch((error) => ({
                department: department.name,
                attractions: [],
              })) // Handle individual errors
        );

        // Await all promises to settle
        const attractionsData = await Promise.allSettled(attractionsPromises);

        // Group attractions by department and city
        const groupedData = attractionsData.reduce((acc, { value }) => {
          if (value) {
            const { department, attractions } = value;
            acc[department] = acc[department] || {};
            attractions.forEach((attraction) => {
              const cityName = attraction.city?.name || "Unknown"; // Adjust if city name is in a different field
              acc[department][cityName] = (acc[department][cityName] || 0) + 1;
            });
          }
          return acc;
        }, {});

        // Transform data for visualization
        const transformedData = Object.entries(groupedData).flatMap(
          ([department, cities]) =>
            Object.entries(cities).map(([city, count]) => ({
              department,
              city,
              count,
            }))
        );

        setData(transformedData);
        setTouristicData(transformedData); // Pass the data to the parent component
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        const end = performance.now(); // End measuring time
        setApiResponseTime(Math.round(end - start)); // Round response time
        setLoading(false);
        // Notify parent component of response time
        setResponseTime(Math.round(end - start));
      }
    };

    fetchData();
  }, [setResponseTime, setTouristicData]);

  // Memoize table rows to optimize rendering
  const dataTable = useMemo(
    () =>
      data.map((item, index) => (
        <tr key={index}>
          <td>{item.department}</td>
          <td>{item.city}</td>
          <td>{item.count}</td>
        </tr>
      )),
    [data]
  );

  return (
    <div>
      <h2>Tourist Attractions</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>City</th>
                  <th>Number of Attractions</th>
                </tr>
              </thead>
              <tbody>{dataTable}</tbody>
            </table>
          </div>

          <p>Response Time: {apiResponseTime} ms</p>
        </>
      )}
    </div>
  );
}

export default TouristicAttractionTab;

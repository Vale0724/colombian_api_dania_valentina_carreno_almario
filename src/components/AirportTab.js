import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function AirportTab({ setResponseTime, setAirportData }) {
  // State to hold the grouped data of airports by department and city
  const [dataByDepartmentCity, setDataByDepartmentCity] = useState([]);

  // State to hold the grouped data of airports by region, department, city, and type
  const [dataByRegion, setDataByRegion] = useState({});

  // State to track the API response time for performance monitoring
  const [localResponseTime, setLocalResponseTime] = useState(0);

  // State to manage loading status while fetching data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from multiple APIs
    const fetchData = async () => {
      setLoading(true); // Set loading state to true before starting the fetch
      const start = Date.now(); // Start a timer to measure response time

      try {
        // Fetch airport, department, city, and region data concurrently
        const [airportResult, departmentResult, cityResult, regionResult] =
          await Promise.all([
            axios.get("https://api-colombia.com/api/v1/Airport"),
            axios.get("https://api-colombia.com/api/v1/Department"),
            axios.get("https://api-colombia.com/api/v1/City"),
            axios.get("https://api-colombia.com/api/v1/Region"),
          ]);

        // Extract data from the API responses
        const airports = airportResult.data;
        const departments = departmentResult.data;
        const cities = cityResult.data;
        const regions = regionResult.data;

        // Create maps for departments, cities, and regions
        const departmentsMap = departments.reduce((acc, dept) => {
          acc[dept.id] = {
            name: dept.name,
            regionId: dept.regionId,
          };
          return acc;
        }, {});

        const citiesMap = cities.reduce((acc, city) => {
          acc[city.id] = city.name;
          return acc;
        }, {});

        const regionsMap = regions.reduce((acc, region) => {
          acc[region.id] = region.name;
          return acc;
        }, {});

        // Group airports by department and city
        const groupedByDepartmentCity = airports.reduce((acc, airport) => {
          const departmentId = airport.deparmentId; // Correct this field
          const cityId = airport.cityId;

          if (departmentsMap[departmentId] && citiesMap[cityId]) {
            const departmentName = departmentsMap[departmentId].name;
            const cityName = citiesMap[cityId];

            if (!acc[departmentName]) {
              acc[departmentName] = {};
            }
            if (!acc[departmentName][cityName]) {
              acc[departmentName][cityName] = 0;
            }
            acc[departmentName][cityName] += 1;
          }

          return acc;
        }, {});

        // Transform the grouped data into an array format suitable for rendering
        const transformedByDepartmentCity = Object.entries(
          groupedByDepartmentCity
        ).flatMap(([department, cities]) =>
          Object.entries(cities).map(([city, count]) => ({
            department,
            city,
            count,
          }))
        );

        // Update the state with the transformed data
        setDataByDepartmentCity(transformedByDepartmentCity);

        // Group airports by region, department, city, and type
        const groupedByRegion = airports.reduce((acc, airport) => {
          const departmentId = airport.deparmentId; // Correct this field
          const cityId = airport.cityId;
          const regionId = departmentsMap[departmentId]?.regionId;

          if (
            departmentsMap[departmentId] &&
            citiesMap[cityId] &&
            regionsMap[regionId]
          ) {
            const regionName = regionsMap[regionId];
            const departmentName = departmentsMap[departmentId].name;
            const cityName = citiesMap[cityId];
            const type = airport.type;

            if (!acc[regionName]) acc[regionName] = {};
            if (!acc[regionName][departmentName])
              acc[regionName][departmentName] = {};
            if (!acc[regionName][departmentName][cityName])
              acc[regionName][departmentName][cityName] = {};
            if (!acc[regionName][departmentName][cityName][type])
              acc[regionName][departmentName][cityName][type] = 0;

            acc[regionName][departmentName][cityName][type] += 1;
          }

          return acc;
        }, {});

        // Update the state with the grouped data
        setDataByRegion(groupedByRegion);

        const end = Date.now(); // Stop the timer
        setLocalResponseTime(end - start); // Calculate and set the API response time
        if (setResponseTime) {
          setResponseTime(end - start);
        }

        // Set airport data to be used in Tabs
        setAirportData({
          byDepartmentCity: transformedByDepartmentCity,
          byRegion: groupedByRegion,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading state to false after data fetch is complete
      }
    };

    fetchData(); // Invoke the data fetching function when the component mounts
  }, [setResponseTime, setAirportData]); // Added setAirportData to dependency array

  const departmentCityTable = useMemo(
    () =>
      dataByDepartmentCity.map((item, index) => (
        <tr key={index}>
          <td>{item.department}</td>
          <td>{item.city}</td>
          <td>{item.count}</td>
        </tr>
      )),
    [dataByDepartmentCity]
  );

  const regionTable = useMemo(() => {
    const flattenRegionData = (data) => {
      return Object.entries(data).flatMap(([region, departments]) =>
        Object.entries(departments).flatMap(([department, cities]) =>
          Object.entries(cities).flatMap(([city, types]) =>
            Object.entries(types).map(([type, count]) => ({
              region,
              department,
              city,
              type,
              count,
            }))
          )
        )
      );
    };

    return flattenRegionData(dataByRegion).map((item, index) => (
      <tr key={index}>
        <td>{item.region}</td>
        <td>{item.department}</td>
        <td>{item.city}</td>
        <td>{item.type}</td>
        <td>{item.count}</td>
      </tr>
    ));
  }, [dataByRegion]);

  return (
    <div>
      <br />
      <h2>Airport Data Overview</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="table-container">
            <h3 className="table-container-h3">
              Grouping by Department and City
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>City</th>
                  <th>Number of Airports</th>
                </tr>
              </thead>
              <tbody>{departmentCityTable}</tbody>
            </table>
          </div>

          <div className="table-container">
            <br />
            <h3>Grouping by Region, Department, City, and Type</h3>
            <table>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Department</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Number of Airports</th>
                </tr>
              </thead>
              <tbody>{regionTable}</tbody>
            </table>
          </div>
          <p>API response time: {localResponseTime} ms</p>
        </>
      )}
    </div>
  );
}

export default AirportTab;

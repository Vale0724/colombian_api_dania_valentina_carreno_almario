import React, { useState, useRef, useEffect } from "react";
import PresidentTab from "./PresidentTab";
import AirportTab from "./AirportTab";
import TouristicAttractionTab from "./TouristicAttractionTab";
import "./Tabs.css";

function Tabs() {
  const [activeTab, setActiveTab] = useState("presidents");
  const [responseTime, setResponseTime] = useState(0);
  const [presidentData, setPresidentData] = useState([]);
  const [airportData, setAirportData] = useState({}); // State for airport data
  const [touristicData, setTouristicData] = useState([]); // State for touristic data
  const lineRef = useRef(null);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab_btn");

    const updateLinePosition = (index) => {
      const activeTabElement = tabs[index];
      if (lineRef.current && activeTabElement) {
        lineRef.current.style.width = `${activeTabElement.offsetWidth}px`;
        lineRef.current.style.left = `${activeTabElement.offsetLeft}px`;
      }
    };

    const activeIndex = Array.from(tabs).findIndex((tab) =>
      tab.classList.contains("active")
    );
    if (activeIndex !== -1) {
      updateLinePosition(activeIndex);
    }

    tabs.forEach((tab, index) => {
      const handleClick = () => {
        updateLinePosition(index);
        setActiveTab(tab.dataset.tab);
      };
      tab.addEventListener("click", handleClick);
      return () => {
        tab.removeEventListener("click", handleClick);
      };
    });
  }, []);

  useEffect(() => {
    console.log("Active Tab:", activeTab);
  }, [activeTab]);

  return (
    <div className="main-container">
      <div className="container">
        <div className="tab_box">
          <button
            className={`tab_btn ${activeTab === "presidents" ? "active" : ""}`}
            data-tab="presidents"
            onClick={() => setActiveTab("presidents")}
          >
            Presidents
          </button>
          <button
            className={`tab_btn ${activeTab === "airports" ? "active" : ""}`}
            data-tab="airports"
            onClick={() => setActiveTab("airports")}
          >
            Airport
          </button>
          <button
            className={`tab_btn ${activeTab === "touristic" ? "active" : ""}`}
            data-tab="touristic"
            onClick={() => setActiveTab("touristic")}
          >
            Touristic Attractions
          </button>
          <div className="line" ref={lineRef}></div>
        </div>
        <div className="content_box">
          {activeTab === "presidents" && (
            <div className="content active">
              <PresidentTab
                setResponseTime={setResponseTime}
                setPresidentData={setPresidentData}
              />
            </div>
          )}
          {activeTab === "airports" && (
            <div className="content active">
              <AirportTab
                setResponseTime={setResponseTime}
                setAirportData={setAirportData} // Pass the setter function for airport data
              />
            </div>
          )}
          {activeTab === "touristic" && (
            <div className="content active">
              <TouristicAttractionTab
                setResponseTime={setResponseTime}
                setTouristicData={setTouristicData}
              />
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div>
          <div className="c-dashboardInfo">
            <div className="wrap">
              <h4 className="c-dashboardInfo__title">Response Time:</h4>
              <span className="c-dashboardInfo__count">{responseTime} ms</span>
            </div>
          </div>
        </div>

        <div className="card json-card">
          <div className="card-body">
            <h2 className="card-title">JSON Data</h2>
            {activeTab === "airports" && airportData && (
              <div className="json-data-container">
                <div className="json-block">
                  <h3>Department and City Data</h3>
                  <pre className="json-data">
                    {JSON.stringify(airportData.byDepartmentCity, null, 2)}
                  </pre>
                </div>
                <div className="json-block">
                  <h3>Region Data</h3>
                  <pre className="json-data">
                    {JSON.stringify(airportData.byRegion, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {activeTab === "touristic" && touristicData && (
              <div className="json-data-container">
                <div className="json-block">
                  <h3>Touristic Attractions Data</h3>
                  <pre className="json-data">
                    {JSON.stringify(touristicData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {activeTab === "presidents" && (
              <pre className="json-data">
                {JSON.stringify(presidentData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;

import React from "react";

// Functional component to display the response time
function ResponseTime({ time }) {
  return (
    <div>
      <p>Response Time: {time} ms</p>{" "}
      {/* Display the response time in milliseconds */}
    </div>
  );
}

export default ResponseTime; // Export the component for use in other parts of the application

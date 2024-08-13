# Project Documentation

## Overview

This project consists of a set of React components that fetch and display data related to presidents, airports, and touristic attractions. The components include:

- `PresidentTab`
- `AirportTab`
- `TouristicAttractionTab`
- `Tabs` (which manages the display of the other tabs)
- `ResponseTime` (displays the response time)

## Components

### PresidentTab

**Description**

Displays data about presidents, grouped by their political parties. The component fetches data from an API, processes it to count the number of presidents per party, and displays it in a table.

**Props**

- `setResponseTime`: A function to set the response time of the API request.
- `setPresidentData`: A function to set the data of presidents.

**Key Features**

- Fetches and processes data from the API.
- Displays a table with the number of presidents per political party.
- Shows the response time of the API request.

### AirportTab

**Description**

Displays data about airports, grouped by department and city, and by region. The component fetches data from an API, processes it, and displays it in tables.

**Props**

- `setResponseTime`: A function to set the response time of the API request.
- `setAirportData`: A function to set the data of airports.

**Key Features**

- Fetches and processes data from the API.
- Displays tables for airports grouped by department and city, and by region.
- Shows the response time of the API request.

### TouristicAttractionTab

**Description**

Displays data about touristic attractions, grouped by department and city. The component fetches data from an API, processes it, and displays it in a table.

**Props**

- `setResponseTime`: A function to set the response time of the API request.
- `setTouristicData`: A function to set the data of touristic attractions.

**Key Features**

- Fetches and processes data from the API.
- Displays a table with the number of touristic attractions per department and city.
- Shows the response time of the API request.

### Tabs

**Description**

Manages the display of the `PresidentTab`, `AirportTab`, and `TouristicAttractionTab` components. Provides tab navigation and handles active tab state.

**State**

- `activeTab`: The currently active tab.
- `responseTime`: The response time of the last API request.
- `presidentData`: Data for the `PresidentTab` component.
- `airportData`: Data for the `AirportTab` component.
- `touristicData`: Data for the `TouristicAttractionTab` component.

**Key Features**

- Provides tab navigation.
- Manages the active tab and displays the corresponding component.
- Displays response time and JSON data for the active tab.

### ResponseTime

**Description**

Displays the response time of the last API request.

**Props**

- `time`: The response time in milliseconds.

## Routing

### App

**Description**

The main entry point of the application that sets up routing using `react-router-dom`. Defines routes for different components and handles 404 errors.

**Key Features**

- Uses `BrowserRouter` to handle routing.
- Defines a route for the main dashboard at `/colombia_dash`.
- Provides a fallback route for 404 errors.

```javascript
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tabs from "./components/Tabs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/colombia_dash" element={<Tabs />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
```

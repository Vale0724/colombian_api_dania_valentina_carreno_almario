import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tabs from './components/Tabs';

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

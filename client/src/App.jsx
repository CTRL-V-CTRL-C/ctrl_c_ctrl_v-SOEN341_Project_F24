import './App.css'
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';

function App() {

  return (
    <>
      <NavBar/>
      <Router>
        <PageHolder/>
      </Router>
    </>
  )
}

export default App;
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';
import './Pages/Components/Styles/BackgroundImage.css';

function App() {

  return (
    <>
      <NavBar />
      <Router>
        <PageHolder />
      </Router>
    </>
  )
}

export default App;
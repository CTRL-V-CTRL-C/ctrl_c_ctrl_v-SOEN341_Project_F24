import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';
import './Pages/Components/Styles/BackgroundImage.css';

function App() {

  return (
    <div className="background-image-container">
      <NavBar />
      <Router>
        <PageHolder />
      </Router>
    </div>
  )
}

export default App;
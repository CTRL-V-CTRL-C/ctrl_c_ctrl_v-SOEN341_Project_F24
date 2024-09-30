import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';
import './Pages/Components/Styles/BackgroundImage.css';
import AuthContext from './Context/AuthContext';
import { useEffect, useState } from 'react';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     if (!userLoggedIn) {
  //       const authResponse = await fetch("/test-authentication");
  //       if (authResponse.status === 200) {
  //         setUserLoggedIn(true);
  //         console.log("1")
  //       } else {
  //         setUserLoggedIn(false)
  //       }
  //     }
  //   })();
  //   console.log("looged in: " + userLoggedIn)
  // }, [userLoggedIn]);

  return (
    <AuthContext.Provider value={{
      userLoggedIn,
      setUserLoggedIn
    }}>

      <NavBar />
      <Router>
        <PageHolder />
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
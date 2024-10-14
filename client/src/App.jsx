import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';
import './Pages/Components/Styles/BackgroundImage.css';
import AuthContext from './Context/AuthContext';
import { useEffect, useState } from 'react';
import { postData } from './Controller/FetchModule';
import SideMenu from './Pages/Components/SideMenu';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    (async () => {
      if (!userLoggedIn) {
        const authResponse = await postData("/api/test-authentication", {});
        if (authResponse.status === 200) {
          setUserLoggedIn(true);
        } else {
          setUserLoggedIn(false)
        }
      }
    })();
  }, [userLoggedIn]);

  return (
    <AuthContext.Provider value={{
      userLoggedIn,
      setUserLoggedIn,
      
    }}>

      <Router>
        <NavBar />
        <SideMenu />
        <PageHolder />
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
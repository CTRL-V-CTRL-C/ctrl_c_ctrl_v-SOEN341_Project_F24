import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import NavBar from './Pages/Components/NavBar';
import './Pages/Components/Styles/BackgroundImage.css';
import UserContext from './Context/UserContext';
import { useEffect, useState } from 'react';
import { fetchData, postData } from './Controller/FetchModule';
import SideMenu from './Pages/Components/SideMenu';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ course_name: "", course_id: 0 });

  useEffect(() => {
    (async () => {
      if (!userLoggedIn) {
        const authResponse = await postData("/api/test-authentication", {});
        if (authResponse.status === 200) {
          let authJSON = await authResponse.json();
          setUserLoggedIn(true);
          setIsInstructor(authJSON.isInstructor);
        } else {
          setUserLoggedIn(false);
          setIsInstructor(false);
        }
      }
      fetchCourses();
    })();
  }, [userLoggedIn]);

  const fetchCourses = async () => {
    const coursesResponse = await fetchData("/api/course/get-courses");
    const courses = await coursesResponse.json();
    setSelectedCourse(courses[0]);
  }

  return (
    <UserContext.Provider value={{
      userLoggedIn,
      setUserLoggedIn,
      isInstructor,
      setIsInstructor,
      selectedCourse,
      setSelectedCourse
    }}>

      <Router>
        <NavBar />
        <SideMenu />
        <PageHolder />
      </Router>
    </UserContext.Provider>
  )
}

export default App;
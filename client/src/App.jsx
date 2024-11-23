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
  const [userID, setUserID] = useState(0);
  const [isInstructor, setIsInstructor] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ course_name: "", course_id: 0 });
  const [courseList, setCourseList] = useState([{ course_name: "", course_id: 0 }]);
  const [hasCourses, setHasCourses] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userLoggedIn) {
        const response = await postData("/api/test-authentication", {});
        if (response.status === 200) {
          let authJSON = await response.json();
          setUserLoggedIn(true);
          setUserID(authJSON.userId);
          setIsInstructor(authJSON.isInstructor);
        } else {
          setUserLoggedIn(false);
          setIsInstructor(false);
        }
      } else {
        await fetchCourses();
      }
    })();
  }, [userLoggedIn]);

  const fetchCourses = async () => {
    const coursesResponse = await fetchData("/api/course/get-courses");
    const courses = await coursesResponse.json();
    setCourseList(courses);
    setHasCourses(courses.length > 0);
    setSelectedCourse(courses[0]);
  }

  return (
    <UserContext.Provider value={{
      userLoggedIn,
      setUserLoggedIn,
      userID,
      setUserID,
      isInstructor,
      setIsInstructor,
      selectedCourse,
      setSelectedCourse,
      hasCourses,
      setHasCourses
    }}>

      <Router>
        <NavBar />
        <SideMenu fetchCourses={fetchCourses} courses={courseList} />
        <div id="main-content" >
          <PageHolder />
        </div>
      </Router>
    </UserContext.Provider>
  )
}

export default App;
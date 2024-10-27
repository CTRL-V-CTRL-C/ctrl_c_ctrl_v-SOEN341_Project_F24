import React from 'react';


const UserContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { },
        userID: 0,
        setUserID: () => { },
        isInstructor: false,
        setIsInstructor: () => { },
        selectedCourse: { course_name:"" , course_id: 0},
        setSelectedCourse: () => { },
    }
);

export default UserContext;
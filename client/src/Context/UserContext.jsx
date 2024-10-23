import React from 'react';

const UserContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { },
        isInstructor: false,
        setIsInstructor: () => { },
        selectedCourse: { course_name: "", course_id: 0 },
        setSelectedCourse: () => { },
    }
);

export default UserContext;
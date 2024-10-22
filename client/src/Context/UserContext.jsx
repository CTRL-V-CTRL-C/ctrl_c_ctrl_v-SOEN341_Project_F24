import React from 'react';

const UserContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { },
        isInstructor: false,
        setIsInstructor: () => { },
        selectedCourse: 0,
        setSelectedCourse: () => { },
    }
);

export default UserContext;
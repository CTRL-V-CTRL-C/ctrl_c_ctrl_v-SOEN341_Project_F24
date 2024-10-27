import React from 'react';

const UserContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { },
        userID: 0,
        setUserID: () => { },
        isInstructor: false,
        setIsInstructor: () => { },
        selectedCourse: 0,
        setSelectedCourse: () => { },
    }
);

export default UserContext;
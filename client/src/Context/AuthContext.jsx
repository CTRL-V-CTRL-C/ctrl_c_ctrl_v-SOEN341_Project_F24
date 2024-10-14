import React from 'react';

const AuthContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { },
        isInstructor: false,
        setIsInstructor: () => { }
    }
);

export default AuthContext;
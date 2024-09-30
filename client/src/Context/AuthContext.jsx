import React from 'react';

const AuthContext = React.createContext(
    {
        userLoggedIn: false,
        setUserLoggedIn: () => { }
    }
);

export default AuthContext;
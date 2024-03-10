import React from 'react';
import CurrentUserContext from '..';

const useAdmin = () => {
    const { currentUser } = React.useContext(CurrentUserContext);
    return currentUser !== null && currentUser.admin;
};

export default useAdmin;

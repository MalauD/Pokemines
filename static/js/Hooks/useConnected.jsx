import React from 'react';
import CurrentUserContext from '..';

const useConnected = () => {
    const { currentUser } = React.useContext(CurrentUserContext);

    return currentUser !== null;
};

export default useConnected;

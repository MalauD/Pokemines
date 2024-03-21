import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useConnected from './Hooks/useConnected';

function ProtectedRoute({ Component, ...props }) {
    const navigate = useNavigate();
    const isConnected = useConnected();

    useEffect(() => {
        if (!isConnected) {
            navigate('/connexion');
        }
    }, [isConnected]);

    return isConnected ? <Component {...props} /> : null;
}

ProtectedRoute.propTypes = {
    Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

export default ProtectedRoute;

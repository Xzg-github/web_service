import React from 'react';
import RootContainer from './RootContainer'

const path = '/enterprise_staff';

const action = () => {
    return {
        wrap: true,
        component: <RootContainer/>
    }
};

export default {path, action};

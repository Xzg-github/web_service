import React from 'react';
import RootContainer from './RootContainer'

const path = '/price_management';

const action = () => {
    return {
        wrap: true,
        component: <RootContainer/>
    }
};

export default {path, action};

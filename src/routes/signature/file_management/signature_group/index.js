import React from 'react';
import RootContainer from './RootContainer';

const path = '/signature_group';

const action = () => {
    return {
        wrap: true,
        component: <RootContainer/>
    }
};

export default {path, action};

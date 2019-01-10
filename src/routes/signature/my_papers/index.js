import React from 'react';
import RootContainer from './RootContainer';

const path = '/my_papers';

const action = () => {
    return {
        wrap: true,
        component: <RootContainer/>
    }
};

export default {path, action};


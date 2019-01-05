import React from 'react';
import DataStatistics from './DataStatistics';
const path = '/data_statistics';

const action = () => {
    return {
        wrap: true,
        component: <DataStatistics />
    }
};

export default {path, action};

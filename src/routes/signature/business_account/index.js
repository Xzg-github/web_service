import React from 'react';
import BusinessAccount from './BusinessAccount';

const path = '/business_account';
const action = () => {
    return {
        wrap: true,
        component: <BusinessAccount/>
    }
};

export default {path, action};

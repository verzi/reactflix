import React, { Component } from "react";
import { Text, View } from "react-native";

import useUser from "../hooks/useUser";
import { ROUTES } from '../navigation/routes';

const withAuth = props => WrappedComponent => {

  const { user, updateUser } = useUser();

 
    return <WrappedComponent {...props} />;
};

export default withAuth;
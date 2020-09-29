/* eslint-disable prettier/prettier */
import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {DrawerContent} from '../pages/home/drawer';
import Home from '../pages/home/home';
import Profile from '../pages/home/profile';

const Drawer = createDrawerNavigator();
const DrawerSlider = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="HomeTab" component={Home} />
    <Drawer.Screen name="Profile" component={Profile} />
  </Drawer.Navigator>
);

export default DrawerSlider;

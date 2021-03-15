/* eslint-disable prettier/prettier */
import React from 'react';
import Home from '../pages/home/home';
import Profile from '../pages/home/profile';
import Referral from '../pages/home/referral';
import {DrawerContent} from '../pages/home/drawer';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const DrawerSlider = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="HomeTab" component={Home} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="Referral" component={Referral} />
  </Drawer.Navigator>
);

export default DrawerSlider;

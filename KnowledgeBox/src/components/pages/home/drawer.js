import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import * as Constants from '../../../constants/constants';
import * as AsyncStorage from '../../../services/asyncStorage';
import {Avatar, Title, Drawer} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

export function DrawerContent(props) {
  const avatar = require('../../../assets/avatar.jpg');
  const user = global.user;

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image source={avatar} size={50} />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>
                  Hello,{' '}
                  {global.user &&
                  (global.user.firstName || global.user.firstname)
                    ? global.user.firstName || global.user.firstname
                    : 'Genius'}
                </Title>
              </View>
            </View>
          </View>

          {global.user ? (
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="home-outline" color={color} size={size} />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('HomeTab');
                }}
              />
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="account-outline" color={color} size={size} />
                )}
                label="Profile"
                onPress={() => {
                  props.navigation.navigate('Profile');
                }}
              />
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Change State"
                onPress={() => {
                  props.navigation.navigate('State', {
                    screen: 'StateList',
                    params: {isGoBack: true},
                  });
                }}
              />
              {/* <DrawerItem
                icon={({color, size}) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Refer and Earn"
                onPress={() => {
                  props.navigation.navigate('Referral');
                }}
              /> */}
            </Drawer.Section>
          ) : (
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="home-outline" color={color} size={size} />
                )}
                label="Home"
                onPress={() => {
                  props.navigation.navigate('HomeTab');
                }}
              />
              {/* <DrawerItem
                icon={({color, size}) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Refer and Earn"
                onPress={() => {
                  props.navigation.navigate('Referral');
                }}
              />*/}
            </Drawer.Section>
          )}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        {global.user ? (
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign Out"
            onPress={async () => {
              await AsyncStorage.clearStorage();
              global.user = null;
              global.selectedTopic = null;
              props.navigation.replace('Auth', {screen: 'AuthPage'});
            }}
          />
        ) : (
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign In/Sign Up."
            onPress={() => {
              props.navigation.replace('Auth', {screen: 'AuthPage'});
            }}
          />
        )}
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginTop: 3,
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../../services/context';

export function DrawerContent(props) {
	//const {signOut, toggleTheme} = React.useContext(AuthContext);
	const avatar = require('../../../assets/avatar.jpg');
	const user = global.user;

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Avatar.Image source={avatar} size={50} />
							<View style={{ marginLeft: 15, flexDirection: 'column' }}>
								<Title style={styles.title}>
									Hello, {global.user && global.user.firstName ? global.user.firstName : 'Genius'}
								</Title>
							</View>
						</View>
					</View>

					{global.user ? (
						<Drawer.Section style={styles.drawerSection}>
							<DrawerItem
								icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
								label="Home"
								onPress={() => {
									props.navigation.navigate('HomeTab');
								}}
							/>
							<DrawerItem
								icon={({ color, size }) => <Icon name="account-outline" color={color} size={size} />}
								label="Profile"
								onPress={() => {
									props.navigation.navigate('Profile');
								}}
							/>
							<DrawerItem
								icon={({ color, size }) => <Icon name="bookmark-outline" color={color} size={size} />}
								label="Change State"
								onPress={() => {
									props.navigation.navigate('State', {
										screen: 'StateList',
										params: { isGoBack: true }
									});
								}}
							/>
						</Drawer.Section>
					) : (
						<Drawer.Section style={styles.drawerSection}>
							<DrawerItem
								icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
								label="Home"
								onPress={() => {
									props.navigation.navigate('HomeTab');
								}}
							/>
							<DrawerItem
								icon={({ color, size }) => <Icon name="bookmark-outline" color={color} size={size} />}
								label="Change State"
								onPress={() => {
									props.navigation.navigate('State', {
										screen: 'StateList',
										params: { isGoBack: true }
									});
								}}
							/>
						</Drawer.Section>
					)}
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomDrawerSection}>
				{global.user ? (
					<DrawerItem
						icon={({ color, size }) => <Icon name="exit-to-app" color={color} size={size} />}
						label="Sign Out"
						onPress={() => {
							//signOut();
							global.user = null;
							props.navigation.replace('Auth', { screen: 'AuthPage' });
						}}
					/>
				) : (
					<DrawerItem
						icon={({ color, size }) => <Icon name="exit-to-app" color={color} size={size} />}
						label="Sign In/Sign Up."
						onPress={() => {
							props.navigation.replace('Auth', { screen: 'AuthPage' });
						}}
					/>
				)}
			</Drawer.Section>
		</View>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1
	},
	userInfoSection: {
		paddingLeft: 20
	},
	title: {
		fontSize: 16,
		marginTop: 3,
		fontWeight: 'bold'
	},
	caption: {
		fontSize: 14,
		lineHeight: 14
	},
	row: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center'
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15
	},
	paragraph: {
		fontWeight: 'bold',
		marginRight: 3
	},
	drawerSection: {
		marginTop: 15
	},
	bottomDrawerSection: {
		marginBottom: 15,
		borderTopColor: '#f4f4f4',
		borderTopWidth: 1
	},
	preference: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16
	}
});

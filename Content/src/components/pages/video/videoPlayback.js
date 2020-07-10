/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';
//import YoutubePlayer from 'react-native-yt-player';

const VideoPlayback = (props) => {
	return (
		<ContainerList title="Video Player" onPress={() => props.navigation.goBack()}>
			{/* <YoutubePlayer loop videoId="Z1LmpiIGYNs" autoPlay /> */}
		</ContainerList>
	);
};

export default VideoPlayback;

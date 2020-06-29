/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoHome from '../pages/video/videoHome';
import VideoTopicList from '../pages/video/videoTopicList';
import VideoList from '../pages/video/videoList';
import VideoPlayback from '../pages/video/videoPlayback';

const VideoStack = createStackNavigator();
const VideoStackScreen = () => (
	<VideoStack.Navigator headerMode="none">
		<VideoStack.Screen name="VideoHome" component={VideoHome} />
		<VideoStack.Screen name="VideoTopicList" component={VideoTopicList} />
		<VideoStack.Screen name="VideoList" component={VideoList} />
		<VideoStack.Screen name="videoPlayback" component={VideoPlayback} />
	</VideoStack.Navigator>
);

export default VideoStackScreen;

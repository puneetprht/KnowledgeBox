/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
//import YoutubePlayer from 'react-native-yt-player';
import YouTube from 'react-native-youtube';

const VideoPlayback = props => {
  const {videoId, title} = props.route.params;

  return (
    <ContainerList title={title} onPress={() => props.navigation.goBack()}>
      {/* <YoutubePlayer loop videoId="Z1LmpiIGYNs" autoPlay /> */}
      <YouTube
        apiKey={Constants.googleApiKey}
        videoId={videoId}
        play={false}
        loop={true}
        fullscreen={false}
        controls={1}
        style={{alignSelf: 'stretch', height: 300}}
        rel={false}
      />
    </ContainerList>
  );
};

export default VideoPlayback;

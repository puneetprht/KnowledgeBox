/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
//import YoutubePlayer from 'react-native-yt-player';
import YouTube from 'react-native-youtube';

const VideoPlayback = props => {
  const {videoId, title} = props.route.params;
  /*const videoId = 'RgKAFK5djSk';
  const title = 'First Video';*/
  const playerRef = useRef();

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
      {/* <SafeAreaView style={{flex: 1}}>
        <YoutubePlayer
          height={300}
          width={400}
          videoId={'RgKAFK5djSk'}
          // play={true}
          // volume={50}
          // playbackRate={1}
          // onChangeState={event => console.log(event)}
          //onReady={() => console.log('ready')}
          // onError={e => console.log(e)}
          // onPlaybackQualityChange={q => console.log(q)}
          // playerParams={{
          //   cc_lang_pref: 'us',
          //   showClosedCaptions: false,
          //}}
        />
      </SafeAreaView> */}
    </ContainerList>
  );
};

export default VideoPlayback;

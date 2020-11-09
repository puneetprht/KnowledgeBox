/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
//import YoutubePlayer from 'react-native-yt-player';
//import YouTube from 'react-native-youtube';
import {WebView} from 'react-native-webview';

const VideoPlayback = (props) => {
  const {videoId, title} = props.route.params;
  /*const videoId = 'RgKAFK5djSk';*/
  // const title = 'First Video';
  const playerRef = useRef();
  const runFirst = `
  var x = document.getElementsByClassName("ytp-chrome-top-buttons");
  x[0].style.display="none";
  true; 
`;

  return (
    <ContainerList title={title} onPress={() => props.navigation.goBack()}>
      <View
        style={{
          flex: 1,
          width: Math.floor(Dimensions.get('window').width / 16) * 16,
          height: Math.floor(Dimensions.get('window').width / 16) * 9,
          maxHeight: Math.floor(Dimensions.get('window').width / 16) * 9,
        }}
        justifyContent="center"
        alignSelf="center">
        <WebView
          style={{
            flex: 1,
            width: Math.floor(Dimensions.get('window').width / 16) * 16,
            height: Math.floor(Dimensions.get('window').width / 16) * 9,
          }}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          source={{
            uri:
              'https://www.youtube.com/embed/' +
              videoId +
              '?rel=0&autoplay=0&showinfo=1&fullscreen=1&controls=1&modestbranding=1&iv_load_policy=3',
          }}
          injectedJavaScript={runFirst}
        />
      </View>
      {/* <YouTube
        apiKey={Constants.googleApiKey}
        videoId={videoId}
        play={false}
        loop={true}
        fullscreen={false}
        controls={1}
        style={{alignSelf: 'stretch', height: 300}}
        rel={false}
      /> */}
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

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
//import YoutubePlayer from 'react-native-yt-player';
//import YouTube from 'react-native-youtube';
import {WebView} from 'react-native-webview';
// import Axios from 'axios';

const VideoPlayback = (props) => {
  const {videoId, title, url, urlName} = props.route.params;
  const [showInfo, setShowInfo] = useState(false);
  /*const videoId = 'RgKAFK5djSk';*/
  // const title = 'First Video';
  // const playerRef = useRef();
  // console.log('Url: ' + url + ' urlName: ', urlName);
  const runFirst = `
  var x = document.getElementsByClassName("ytp-chrome-top-buttons");
  x[0].style.display="none";
  true; 
`;

const downloadAttachment = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Need read/write permission',
      message: 'Need file Read/Write permission.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED){
    const { dirs } = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: urlName,
      path: `${dirs.DownloadDir}/${urlName}`,
    },
    })
    .fetch('GET', url, {})
    .then((res) => {
      console.log('The file saved to ', res.path());
    })
    .catch((e) => {
      setShowInfo(true);
      console.log(e);
    });
  } else {
    setShowInfo(true);
    Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
  }
};

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
      {url ?
      <View>
      <Text style={{fontSize: 18, marginTop: 20, margin: 10}}>Download Class Notes / क्लास नोट्स डाउनलोड करें:</Text>
      <View style={{ width: Dimensions.get('window').width}} flexDirection="column" alignItems="center" justifyContent="center">
        <TouchableOpacity onPress={() => downloadAttachment()}>
          {/* <Icon name="cloud-download" color={Constants.gradientColor1} size={50} /> */}
          <Image
                  source={require('../../../assets/pdfImage.jpg')}
                  style={{
                    width: 60,
                    height: 60,
                    marginHorizontal: 15,
                    marginVertical: 5,
                  }}
                />
        </TouchableOpacity>
      </View>
      </View>
      : null }
      { showInfo ?
      <View>
        <Text style={{fontSize: 18, marginTop: 30, margin: 10}}>If unable to download please check storage permission for Knowledge Box app in settings.</Text>
        <Text style={{fontSize: 18, margin: 10}}>अगर डाउनलोड करने में असमर्थ हैं तो कृपया सेटिंग में नॉलेज बॉक्स ऐप के लिए स्टोरेज अनुमति की जांच करें</Text>
      </View> : null }
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

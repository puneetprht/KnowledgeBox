/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from '../../../services/axios';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import * as csvtojson from '../../../services/csvToJson';
import {decode} from 'base64-arraybuffer';
//import Amplify, {Auth, Storage} from 'aws-amplify';
//import {S3} from 'aws-sdk/dist/aws-sdk-react-native';

const TestList = (props) => {
  const [list, setList] = useState([]);
  //const [listCSV, setListCSV] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  /*Amplify.configure({
    Auth: {
      identityPoolId: 'ap-south-1:1757063d-6ae6-48fd-971b-4278561c408f', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'ap-south-1', // REQUIRED - Amazon Cognito Region
      // userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
      // userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
    },
    Storage: {
      AWSS3: {
        bucket: 'knowledge2020box', //REQUIRED -  Amazon S3 bucket name
        region: 'ap-south-1', //OPTIONAL -  Amazon service region
      },
    },
  });*/

  const {SubTopicId, title, user, catergoryId, subjectId} = props.route.params;
  let {refresh} = props.route.params;
  /*const user = {isAdmin: true};
  const SubTopicId = 6;
  const title = 'Science';
  const catergoryId = 3;
  const subjectId = 2;
  let refresh = true;*/

  useEffect(() => {
    onRefresh();
    refresh = false;
  }, [refresh]);

  const onRefresh = () => {
    fetchAllTopics();
  };

  const fetchAllTopics = () => {
    axios
      .get('/test/getTestList', {
        params: {
          id: SubTopicId,
        },
      })
      .then((response) => {
        if (response.data) {
          setList(response.data);
        } else {
          setList([]);
        }
      })
      .catch((err) => {
        console.log('FetchAllTopics: ', err);
      });
  };

  const openDetail = (index, evt) => {
    props.navigation.navigate('TestQuestionnaire', {
      testId: index.id,
      title: index.value,
      testTime: index.time || 0,
      testInstructions: index.instructions || '',
      user: user,
      catergoryId: catergoryId,
    });
  };

  const deleteTest = (id) => {
    if (id) {
      axios
        .delete('/test/deleteTest', {
          data: {
            id: id,
          },
        })
        .then((response) => {
          fetchAllTopics();
        })
        .catch((err) => {
          console.log('deleteTest: ', err);
        });
    }
  };

  const addTest = () => {
    props.navigation.navigate('TestAdmin', {
      user: user,
      catergoryId: catergoryId,
      subjectId: subjectId,
      subTopicId: SubTopicId,
      title: title,
      testId: null,
      testTitle: '',
      testTime: 0,
      testInstructions: '',
      testDetail: [],
    });
  };

  const editTest = (index) => {
    props.navigation.navigate('TestAdmin', {
      user: user,
      catergoryId: catergoryId,
      subjectId: subjectId,
      subTopicId: SubTopicId,
      title: title,
      testId: index.id,
      testTitle: index.value,
      testTime: index.time || 0,
      testInstructions: index.instructions || '',
      testDetail: [],
    });
  };

  const processTest = (test) => {
    let testObject = [];
    if (test && test.testDetail.length > 0) {
      test.testDetail.forEach((element) => {
        var object = {};
        object.question = element.Question || '';
        object.option1 = element.Option1.toString() || '';
        object.option2 = element.Option2.toString() || '';
        object.option3 = element.Option3.toString() || '';
        object.option4 = element.Option4.toString() || '';
        object.questionLang = element.Question_Hindi || '';
        object.optionLang1 = element.Option1_Hindi.toString() || '';
        object.optionLang2 = element.Option2_Hindi.toString() || '';
        object.optionLang3 = element.Option3_Hindi.toString() || '';
        object.optionLang4 = element.Option4_Hindi.toString() || '';
        object.weightage = element.PositiveMarks || 0;
        object.negativeWeightage = element.NegativeMarks || 0;
        object.correctOption =
          element.CorrectAnswer.toString().split(',').map(Number) || [];
        object.isMultiple =
          element.CorrectAnswer.toString().split(',').length > 1 || false;
        object.explaination = element.Explanation || '';
        object.explainationLang = element.Explanation_Hindi || '';
        object.videoUrl = element.videoUrl || '';
        object.videoUrlId = element.videoUrl
          ? getVideoUrlId(element.videoUrl)
          : '';
        testObject.push(object);
      });
      //console.log(testObject);
      props.navigation.navigate('TestAdmin', {
        user: user,
        catergoryId: catergoryId,
        subjectId: subjectId,
        subTopicId: SubTopicId,
        title: title,
        testId: 0,
        testTitle: test.testHeader[0].QuizName || '',
        testTime: test.testHeader[0].Time || 0,
        testInstructions: test.testHeader[0].Instructions || '',
        testDetail: testObject,
      });
    }
  };

  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const getVideoUrlId = (val) => {
    let videoUrlId = getQueryParams('v', val);
    if (!videoUrlId) {
      videoUrlId = val.split('.be/')[1];
    }
    return videoUrlId;
  };

  const SingleFilePicker = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Need read/write permission',
          message: 'Need file Read/Write permission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res.uri);
      console.log(res.name);
      console.log(res.type);
      const file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: res.uri,
        name: res.name,
        type: res.type,
      };

      if (res && res.uri) {
        let filePath = '';
        if (Platform.OS === 'ios') {
          let arr = res.uri.split('/');
          const dirs = RNFetchBlob.fs.dirs;
          filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
        } else {
          filePath = res.uri;
        }

        RNFetchBlob.fs
          .readStream(filePath, 'utf8')
          .then((stream) => {
            let data = '';
            stream.open();
            stream.onData((chunk) => {
              data += chunk;
            });
            stream.onEnd(() => {
              if (res.type === 'text/comma-separated-values') {
                console.log('PreProcessor:', data);
                //data = data.replace(/\t/g, ' ');
                data = csvtojson.cleanTabs(data);
                console.log('PostProcessor:', data);
              }
              console.log('Raw Data:', data);
              let testArray = data.split(/\r?\n/);
              let testHeader = [];
              let testDetail = [];
              let test = {};
              testHeader.push(testArray[0]);
              testHeader.push(testArray[1]);
              for (let i = 2; i < testArray.length; i++) {
                testDetail.push(testArray[i]);
              }
              //console.log('csvtojson:', csvtojson);
              test.testHeader = csvtojson.csvToJson(
                csvtojson.commaToPipe(testHeader.join('\n')),
                '|',
              );
              //console.log('TEST:', testArray);
              test.testDetail = csvtojson.csvToJson(
                csvtojson.commaToPipe(testDetail.join('\n')),
                '|',
              );
              console.log('TEST:', test);
              processTest(test);
            });
          })
          .catch((err) => {
            console.log('err:', err);
          });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        console.log(err);
      }
    }
  };

  const SingleImagePicker = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Need read/write permission',
          message: 'Need file Read/Write permission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res.uri);
      console.log(res.name);
      console.log(res.type);
      const file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: res.uri,
        name: res.name,
        type: res.type,
      };

      /*const options = {
        keyPrefix: 'Images/',
        bucket: 'knowledge2020box',
        region: 'ap-south-1',
        accessKey: 'AKIASAPEFXWEJ5UIJLMY',
        secretKey: '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',
        successActionStatus: 201,
      };*/

      /*const options = {
        keyPrefix: 'Images/',
        bucket: 'knowledge2020box',
        region: 'ap-south-1',
        accessKey: 'AKIASAPEFXWEGWNNSAO4',
        secretKey: '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',
        successActionStatus: 201,
        //awsUrl: 's3.ap-south-1.amazonaws.com',
      };*/

      console.log('starting to read');
      /*const s3bucket = new S3({
        accessKeyId: 'AKIASAPEFXWEGWNNSAO4',
        secretAccessKey: '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',
        Bucket: 'knowledge2020box',
        signatureVersion: 'v4',
      });*/

      let contentType = file.type;
      let contentDeposition = 'inline;filename="' + file.name + '"';
      /*RNFetchBlob.fs
        .readStream(file.uri, 'base64')
        .then((stream) => {
          let data = '';
          stream.open();
          stream.onData((chunk) => {
            data += chunk;
            console.log(data);
          });
          stream.onEnd(() => {
            const arrayBuffer = decode(data);
            console.log(arrayBuffer);
            /*s3bucket.createBucket(() => {
              const params = {
                Bucket: 'knowledge2020box',
                Key: file.name,
                Body: arrayBuffer,
                ContentDisposition: contentDeposition,
                ContentType: contentType,
              };
              s3bucket.upload(params, (err, data) => {
                if (err) {
                  console.log('error in callback', err);
                }
                console.log('success');
                console.log('Respomse URL : ' + data);
              });
            });
            try {
              const response = await fetch(pathToImageFile)
          
              const blob = await response.blob()-

              Storage.put(file.name, data, {
                contentType: file.type,
              });
            } catch (err) {
              console.log(err);
            }
          });
        })
        .catch((err) => {
          console.log('err:', err);
        });*/

      /*RNS3.put(file, options)
        .then((response) => {
          if (response.status !== 201) {
            console.log(response.body);
            throw new Error('Failed to upload image to S3');
          }
          console.log(response.body);
          /**
           * {
           *   postResponse: {
           *     bucket: "your-bucket",
           *     etag : "9f620878e06d28774406017480a59fd4",
           *     key: "uploads/image.png",
           *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
           *   }
           * }
           
        })
        .catch(function (err) {
          console.log(err);
        });*/
      if (res && res.uri) {
        let filePath = '';
        if (Platform.OS === 'ios') {
          let arr = res.uri.split('/');
          const dirs = RNFetchBlob.fs.dirs;
          filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
        } else {
          filePath = res.uri;
        }

        RNFetchBlob.fs
          .readStream(filePath, 'utf8')
          .then((stream) => {
            let data = '';
            stream.open();
            stream.onData((chunk) => {
              data += chunk;
            });
            stream.onEnd(() => {
              let testArray = data.split(/\r?\n/);
              let testHeader = [];
              let testDetail = [];
              let test = {};
              testHeader.push(testArray[0]);
              testHeader.push(testArray[1]);
              for (let i = 2; i < testArray.length; i++) {
                testDetail.push(testArray[i]);
              }
              console.log('csvtojson:', csvtojson);
              test.testHeader = csvtojson.csvToJson(
                csvtojson.commaToPipe(testHeader.join('\n')),
                '|',
              );
              test.testDetail = csvtojson.csvToJson(
                csvtojson.commaToPipe(testDetail.join('\n')),
                '|',
              );
              processTest(test);
            });
          })
          .catch((err) => {
            console.log('err:', err);
          });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <ContainerList
      title={title + ' tests'}
      onPress={() => props.navigation.goBack()}>
      <ScrollView
        style={{marginBottom: 30}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.Container}>
          {list.map((l) => {
            return (
              <View key={l.id} style={styles.boxSimple}>
                <View style={styles.boxLeft}>
                  <Text style={styles.textLeft}>{l.value}</Text>
                </View>
                <View style={styles.boxRight}>
                  <PButton
                    title="Start"
                    onPress={openDetail.bind(this, l)}
                    viewStyle={styles.button}
                    textStyle={{fontFamily: 'Roboto-Medium', fontSize: 17}}
                    elementStyle={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  />
                  {user && user.isAdmin ? (
                    <TouchableOpacity
                      onPress={editTest.bind(this, l)}
                      style={{
                        ...styles.icon,
                        padding: 5,
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        backgroundColor: 'grey',
                      }}>
                      <Icon name="edit" style={{color: 'white'}} size={15} />
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
                {user && user.isAdmin ? (
                  <TouchableOpacity
                    onPress={deleteTest.bind(this, l.id)}
                    style={{
                      ...styles.icon,
                      position: 'absolute',
                      backgroundColor: '#de3500',
                    }}>
                    <Icon name="delete" style={{color: 'white'}} size={15} />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            );
          })}
          {user && user.isAdmin ? (
            <View
              style={{marginTop: 10}}
              justifyContent="center"
              alignItems="center">
              <View>
                <PButton
                  title="Add Test"
                  onPress={() => addTest()}
                  viewStyle={{
                    width: '65%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text size="26" fontWeight="bold">
                  OR
                </Text>
              </View>
              <View style={{marginTop: 10}}>
                <TouchableOpacity onPress={() => SingleFilePicker()}>
                  <IconFA5
                    name="file-csv"
                    style={{color: Constants.textColor1}}
                    size={45}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    marginHorizontal: 10,
  },
  boxSimple: {
    borderBottomWidth: 1,
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  boxLeft: {
    flex: 1,
    borderRightWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxRightOptions: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textLeft: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Constants.textColor1,
    width: '90%',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 25,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default TestList;

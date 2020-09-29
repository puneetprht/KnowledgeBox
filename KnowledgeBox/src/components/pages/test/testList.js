/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import * as csvtojson from '../../../services/csvToJson';

const TestList = (props) => {
  const [list, setList] = useState([]);
  const [listCSV, setListCSV] = useState([]);
  const {
    SubTopicId,
    title,
    user,
    stateId,
    catergoryId,
    subjectId,
  } = props.route.params;
  let {refresh} = props.route.params;
  /*const user = {isAdmin: true};
  const SubTopicId = 6;
  const title = 'Science';
  const stateId = 8;
  const catergoryId = 3;
  const subjectId = 2;
  let refresh = true;*/

  const fetchAllTopics = () => {
    axios
      .get('http://3.7.66.184:3000/test/getTestList', {
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
  useEffect(() => {
    fetchAllTopics();
    refresh = false;
  }, [refresh]);

  const openDetail = (index, evt) => {
    props.navigation.navigate('TestQuestionnaire', {
      testId: index.id,
      title: index.value,
      testTime: index.time || 0,
      testInstructions: index.instructions || '',
      user: user,
      stateId: stateId,
      catergoryId: catergoryId,
    });
  };

  const deleteTest = (id) => {
    if (id) {
      axios
        .delete('http://3.7.66.184:3000/test/deleteTest', {
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
      stateId: stateId,
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
      stateId: stateId,
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
      //console.log(test.testHeader);
      props.navigation.navigate('TestAdmin', {
        user: user,
        stateId: stateId,
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
      <ScrollView style={{marginBottom: 30}}>
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
                    textStyle={{fontSize: 17}}
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Constants.textColor1,
    width: '90%',
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

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

const QuizList = (props) => {
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {SubTopicId, title, user, catergoryId, subjectId} = props.route.params;
  let {refresh} = props.route.params;

  useEffect(() => {
    onRefresh();
    refresh = false;
  }, [refresh]);

  const onRefresh = () => {
    fetchAllTopics();
  };

  const fetchAllTopics = () => {
    axios
      .get('/quiz/getQuizList', {
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
        console.log(err);
      });
  };

  const openDetail = (index, evt) => {
    props.navigation.navigate('QuizQuestionnaire', {
      quizId: index.id,
      title: index.value,
      quizTime: index.time || 0,
      user: user,
      catergoryId: catergoryId,
    });
  };

  const deleteQuiz = (id) => {
    if (id) {
      axios
        .delete('/quiz/deleteQuiz', {
          data: {
            id: id,
          },
        })
        .then((response) => {
          fetchAllTopics();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const addQuiz = () => {
    props.navigation.navigate('QuizAdmin', {
      user: user,
      catergoryId: catergoryId,
      subjectId: subjectId,
      subTopicId: SubTopicId,
      title: title,
      quizId: null,
      quizTime: 0,
      quizDetail: [],
    });
  };

  const editQuiz = (index) => {
    props.navigation.navigate('QuizAdmin', {
      user: user,
      catergoryId: catergoryId,
      subjectId: subjectId,
      subTopicId: SubTopicId,
      title: title,
      quizId: index.id,
      quizTime: index.time || 0,
      quizDetail: [],
    });
  };

  const processQuiz = (quiz) => {
    let quizObject = [];
    if (quiz && quiz.quizDetail.length > 0) {
      quiz.quizDetail.forEach((element) => {
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
        quizObject.push(object);
      });
      //console.log(quizObject);
      props.navigation.navigate('QuizAdmin', {
        user: user,
        catergoryId: catergoryId,
        subjectId: subjectId,
        subTopicId: SubTopicId,
        title: title,
        quizId: 0,
        quizTime: 0,
        quizDetail: quizObject,
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
              if (res.type === 'text/comma-separated-values') {
                data = csvtojson.cleanTabs(data);
              }
              let quizArray = data.split(/\r?\n/);
              let quizHeader = [];
              let quizDetail = [];
              let quiz = {};
              quizHeader.push(quizArray[0]);
              quizHeader.push(quizArray[1]);
              for (let i = 2; i < quizArray.length; i++) {
                quizDetail.push(quizArray[i]);
              }
              quiz.quizHeader = csvtojson.csvToJson(
                csvtojson.commaToPipe(quizHeader.join('\n')),
                '|',
              );
              quiz.quizDetail = csvtojson.csvToJson(
                csvtojson.commaToPipe(quizDetail.join('\n')),
                '|',
              );
              //console.log('TEST:', quiz);
              processQuiz(quiz);
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
      title={title + ' quizes'}
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
                      onPress={editQuiz.bind(this, l)}
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
                    onPress={deleteQuiz.bind(this, l.id)}
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
                  title="Add Quiz"
                  onPress={() => addQuiz()}
                  viewStyle={{
                    width: '55%',
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

export default QuizList;

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import axios from 'axios';
import ContainerList from '../../../widgets/List/containerList';

const TestAdmin = (props) => {
  const [key, setKey] = useState(0);
  const {
    user,
    stateId,
    catergoryId,
    subjectId,
    subTopicId,
    title,
    testId,
    testTime,
    testTitle,
    testInstructions,
    testDetail,
  } = props.route.params;
  const [isSubmit, setIsSubmit] = useState(false);
  const [testName, setTestName] = useState(testTitle);
  const [timeDuration, setTimeDuration] = useState(testTime);
  const questionObject = {
    id: 0,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    questionLang: '',
    optionLang1: '',
    optionLang2: '',
    optionLang3: '',
    optionLang4: '',
    explaination: '',
    explainationLang: '',
    videoUrl: '',
    videoUrlId: '',
    weightage: 1,
    negativeWeightage: 0,
    correctOption: [],
    isMultiple: false,
  };
  const [questionsList, setQuestionsList] = useState([questionObject]);
  const [languageFlag, setLanguage] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [instructions, setInstructions] = useState(testInstructions);

  useEffect(() => {
    if (testId) {
      axios
        .get('http://' + Constants.apiDomain + '/test/getTestDetail', {
          params: {
            id: testId,
          },
        })
        .then((response) => {
          if (response.data) {
            setQuestionsList(response.data);
          }
          //alert('Gettings');
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (testDetail.length) {
      console.log('setQuestionsList:', testDetail);
      setQuestionsList(testDetail);
    }
  }, []);

  const onOptionPress = (index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (
      questions[key].correctOption.includes(index) &&
      questions[key].isMultiple
    ) {
      questions[key].correctOption.splice(
        questions[key].correctOption.indexOf(index),
        1,
      );
    } else if (
      questions[key].correctOption.includes(index) &&
      !questions[key].isMultiple
    ) {
      questions[key].correctOption = [];
    } else {
      if (questions[key].isMultiple) {
        questions[key].correctOption.push(index);
        questions[key].correctOption.sort();
      } else {
        questions[key].correctOption = [];
        questions[key].correctOption.push(index);
      }
    }
    setQuestionsList(questions);
  };

  const submitTest = () => {
    setIsSubmit(true);
    const submitAnswers = [];
    axios
      .post('http://' + Constants.apiDomain + '/test/postTest', {
        subTopicId: subTopicId,
        subjectId: subjectId,
        categoryId: catergoryId,
        stateId: stateId,
        questions: questionsList,
        testName: testName,
        testId: testId,
        testTime: parseFloat(timeDuration),
        testInstructions: instructions,
      })
      .then((response) => {
        setIsSubmit(false);
        props.navigation.navigate('TestList', {
          SubTopicId: subTopicId,
          title: title,
          user: user,
          stateId: stateId,
          catergoryId: catergoryId,
          subjectId: subjectId,
          refresh: true,
        });
      })
      .catch((err) => {
        setIsSubmit(false);
        console.log(err);
      });
  };

  const nextQuestion = (index, evt) => {
    if (index < questionsList.length - 1) {
      setKey(index + 1);
    } else {
      const questions = JSON.parse(JSON.stringify(questionsList));
      questions.push(questionObject);
      setQuestionsList(questions);
      setKey(index + 1);
    }
    setLanguage(false);
  };

  const prevQuestion = (index, evt) => {
    setKey(index - 1);
    setLanguage(false);
  };

  const isMultiple = (bool) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].isMultiple = bool;
    setQuestionsList(questions);
  };

  const saveQuestion = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key].questionLang = val;
    } else {
      questions[key].question = val;
    }
    setQuestionsList(questions);
  };

  const saveOption = (val, index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key]['optionLang' + index] = val;
    } else {
      questions[key]['option' + index] = val;
    }
    setQuestionsList(questions);
  };

  const saveWeightage = (val, flag = true) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (flag) {
      questions[key].weightage = val;
    } else {
      questions[key].negativeWeightage = val;
    }
    setQuestionsList(questions);
  };

  const saveExplanation = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    if (languageFlag) {
      questions[key].explainationLang = val;
    } else {
      questions[key].explaination = val;
    }
    setQuestionsList(questions);
  };

  const getQueryParams = (params, url) => {
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

  const saveVideoUrl = (val) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    questions[key].videoUrl = val;
    questions[key].videoUrlId = getQueryParams('v', val);
    if (!questions[key].videoUrlId) {
      questions[key].videoUrlId = val.split('.be/')[1];
    }
    setQuestionsList(questions);
  };

  const validateQuiz = () => {
    return (
      questionsList[key].question &&
      questionsList[key].option1 &&
      questionsList[key].option2 &&
      questionsList[key].option3 &&
      questionsList[key].option4 &&
      questionsList[key].correctOption.length
    );
  };

  const deleteQuestion = (index) => {
    const questions = JSON.parse(JSON.stringify(questionsList));
    console.log(questions);
    questions.splice(index, 1);
    console.log(questions);
    setQuestionsList(questions);
    setKey(index - 1);
  };

  return (
    <KeyboardAvoidingView>
      {!introDone ? (
        <ContainerList
          title={testTitle}
          onPress={() => props.navigation.goBack()}>
          <ScrollView style={{marginBottom: 30}}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 19,
                fontWeight: 'bold',
                alignSelf: 'center',
              }}>
              {' '}
              Enter Instructions{' '}
            </Text>
            <TextInput
              textAlign="left"
              style={
                (styles.textArea2,
                {
                  marginVertical: 15,
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  width: '95%',
                })
              }
              placeholder="Enter Instructions / निर्देश लिखिए"
              multiline={true}
              scrollEnabled={true}
              maxLength={1000}
              onChangeText={(val) => setInstructions(val)}
              value={instructions}
            />
            <PButton
              title={'Continue'}
              onPress={() => setIntroDone(true)}
              viewStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
            />
          </ScrollView>
        </ContainerList>
      ) : (
        <ScrollView style={{marginBottom: 30}}>
          <LinearGradient
            colors={[Constants.gradientColor1, Constants.gradientColor2]}
            style={{
              paddingVertical: 20,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
            }}>
            <View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View
                  style={{marginLeft: 40, justifyContent: 'space-around'}}
                  flexDirection="row">
                  <TextInput
                    textAlign="center"
                    style={{
                      ...styles.textArea2,
                      width: '70%',
                      alignSelf: 'center',
                    }}
                    value={testName}
                    placeholder="Enter Test Name"
                    placeholderTextColor={'white'}
                    onChangeText={(val) => setTestName(val)}
                  />
                  <TextInput
                    textAlign="center"
                    style={{
                      ...styles.textArea2,
                      marginLeft: 20,
                      width: '15%',
                      alignSelf: 'center',
                    }}
                    value={
                      timeDuration ? String(timeDuration) : String(timeDuration)
                    }
                    keyboardType="number-pad"
                    placeholder="Time"
                    placeholderTextColor={'white'}
                    onChangeText={(val) => setTimeDuration(val)}
                  />
                  <TouchableOpacity onPress={() => setLanguage(!languageFlag)}>
                    <Image
                      source={require('../../../assets/language.png')}
                      style={{
                        width: 30,
                        height: 30,
                        marginLeft: 20,
                        margin: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    paddingLeft: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      introDone
                        ? setIntroDone(false)
                        : props.navigation.goBack()
                    }>
                    <Icon
                      name="chevron-left"
                      style={{color: 'white'}}
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              {renderProgressBar(questionsList.length, key)}
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 20,
                  marginTop: 10,
                  color: 'white',
                }}>
                Question {key + 1}
              </Text>
              <View
                flexDirection="row"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    marginLeft: 20,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 30,
                    color: 'white',
                  }}>
                  {' '}
                  +{' '}
                </Text>
                <TextInput
                  textAlign="center"
                  style={{
                    ...styles.textArea2,
                    width: '15%',
                    alignSelf: 'center',
                  }}
                  value={
                    questionsList[key].weightage
                      ? questionsList[key].weightage.toString()
                      : '0'
                  }
                  keyboardType="number-pad"
                  placeholderTextColor={'white'}
                  onChangeText={(val) => saveWeightage(val)}
                />
                <Text
                  style={{
                    marginLeft: 20,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 35,
                    color: 'white',
                  }}>
                  {' '}
                  -{' '}
                </Text>
                <TextInput
                  textAlign="center"
                  style={{
                    ...styles.textArea2,
                    width: '15%',
                    alignSelf: 'center',
                  }}
                  value={
                    questionsList[key].negativeWeightage
                      ? questionsList[key].negativeWeightage.toString()
                      : '0'
                  }
                  keyboardType="number-pad"
                  placeholderTextColor={'white'}
                  onChangeText={(val) => saveWeightage(val, false)}
                />
              </View>
              <TextInput
                textAlign="left"
                style={styles.textArea2}
                placeholderTextColor={'white'}
                placeholder={!languageFlag ? 'Enter Question' : 'प्रश्न लिखिए '}
                multiline={true}
                scrollEnabled={true}
                numberOfLines={5}
                maxLength={1000}
                onChangeText={(val) => saveQuestion(val)}
                value={
                  languageFlag
                    ? questionsList[key].questionLang
                    : questionsList[key].question
                }
              />
            </View>
            <View />
          </LinearGradient>
          <View
            flexDirection="row"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '30%',
                backgroundColor: !questionsList[key].isMultiple
                  ? 'orange'
                  : 'white',
                borderBottomRightRadius: 15,
                borderBottomLeftRadius: 15,
              }}>
              <TouchableOpacity onPress={() => isMultiple(false)}>
                <Text
                  style={{
                    color: !questionsList[key].isMultiple ? 'white' : 'black',
                    textAlign: 'center',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 13,
                    margin: 3,
                  }}>
                  Single Choice
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '30%',
                backgroundColor: questionsList[key].isMultiple
                  ? 'orange'
                  : 'white',
                borderBottomRightRadius: 15,
                borderBottomLeftRadius: 15,
              }}>
              <TouchableOpacity onPress={() => isMultiple(true)}>
                <Text
                  style={{
                    color: !questionsList[key].isMultiple ? 'black' : 'white',
                    textAlign: 'center',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 13,
                    margin: 3,
                  }}>
                  Multiple Choice
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            flexDirection="row"
            style={{
              marginHorizontal: 10,
              marginVertical: 10,
              justifyContent: 'space-evenly',
            }}>
            <ElevatedView
              elevation={5}
              style={{
                ...styles.elevatedStyle,
                borderColor: questionsList[key].correctOption.includes(1)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <TouchableOpacity
                onPress={onOptionPress.bind(this, 1)}
                style={styles.elevatedStyleTO}>
                <Text
                  style={{
                    ...styles.answerText2,
                    color: Constants.textColor1,
                  }}>
                  1
                </Text>
              </TouchableOpacity>
            </ElevatedView>
            <ElevatedView
              elevation={5}
              style={{
                ...styles.elevatedStyle,
                borderColor: questionsList[key].correctOption.includes(2)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <TouchableOpacity
                onPress={onOptionPress.bind(this, 2)}
                style={styles.elevatedStyleTO}>
                <Text
                  style={{
                    ...styles.answerText2,
                    color: Constants.textColor1,
                  }}>
                  2
                </Text>
              </TouchableOpacity>
            </ElevatedView>
            <ElevatedView
              elevation={5}
              style={{
                ...styles.elevatedStyle,
                borderColor: questionsList[key].correctOption.includes(3)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <TouchableOpacity
                onPress={onOptionPress.bind(this, 3)}
                style={styles.elevatedStyleTO}>
                <Text
                  style={{
                    ...styles.answerText2,
                    color: Constants.textColor1,
                  }}>
                  3
                </Text>
              </TouchableOpacity>
            </ElevatedView>
            <ElevatedView
              elevation={5}
              style={{
                ...styles.elevatedStyle,
                borderColor: questionsList[key].correctOption.includes(4)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <TouchableOpacity
                onPress={onOptionPress.bind(this, 4)}
                style={styles.elevatedStyleTO}>
                <Text
                  style={{
                    ...styles.answerText2,
                    color: Constants.textColor1,
                  }}>
                  4
                </Text>
              </TouchableOpacity>
            </ElevatedView>
          </View>
          <View style={{alignItems: 'center', margin: 10, marginTop: 15}}>
            <View
              style={{
                ...styles.stayElevated,
                borderWidth: 3,
                borderColor: questionsList[key].correctOption.includes(1)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  placeholder={!languageFlag ? 'Enter Option 1' : 'विकल्प १'}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={2}
                  maxLength={200}
                  onChangeText={(val) => saveOption(val, 1)}
                  value={
                    languageFlag
                      ? questionsList[key].optionLang1
                      : questionsList[key].option1
                  }
                />
              </ElevatedView>
            </View>
            <View
              style={{
                ...styles.stayElevated,
                borderWidth: 3,
                borderColor: questionsList[key].correctOption.includes(2)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  placeholder={!languageFlag ? 'Enter Option 2' : 'विकल्प २'}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={2}
                  maxLength={200}
                  onChangeText={(val) => saveOption(val, 2)}
                  value={
                    languageFlag
                      ? questionsList[key].optionLang2
                      : questionsList[key].option2
                  }
                />
              </ElevatedView>
            </View>
            <View
              style={{
                ...styles.stayElevated,
                borderWidth: 3,
                borderColor: questionsList[key].correctOption.includes(3)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  placeholder={!languageFlag ? 'Enter Option 3' : 'विकल्प ३'}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={2}
                  maxLength={200}
                  onChangeText={(val) => saveOption(val, 3)}
                  value={
                    languageFlag
                      ? questionsList[key].optionLang3
                      : questionsList[key].option3
                  }
                />
              </ElevatedView>
            </View>
            <View
              style={{
                ...styles.stayElevated,
                borderWidth: 3,
                borderColor: questionsList[key].correctOption.includes(4)
                  ? Constants.textColor1
                  : 'white',
              }}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  placeholder={!languageFlag ? 'Enter Option 4' : 'विकल्प ४ '}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={2}
                  maxLength={200}
                  onChangeText={(val) => saveOption(val, 4)}
                  value={
                    languageFlag
                      ? questionsList[key].optionLang4
                      : questionsList[key].option4
                  }
                />
              </ElevatedView>
            </View>
            <View
              style={{
                width: '30%',
                backgroundColor: 'orange',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 15,
                  margin: 3,
                }}>
                Video URL
              </Text>
            </View>
            <View style={{...styles.stayElevated, marginTop: 0}}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  multiline={true}
                  scrollEnabled={true}
                  maxLength={500}
                  onChangeText={(val) => saveVideoUrl(val)}
                  value={questionsList[key].videoUrl}
                />
              </ElevatedView>
            </View>
            <View
              style={{
                width: '30%',
                backgroundColor: 'orange',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                marginTop: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 15,
                  margin: 3,
                }}>
                {!languageFlag ? 'Explanation' : 'विवरण'}
              </Text>
            </View>
            <View style={{...styles.stayElevated, marginTop: 0}}>
              <ElevatedView elevation={5} style={{borderRadius: 10}}>
                <TextInput
                  textAlign="left"
                  style={styles.textArea}
                  multiline={true}
                  scrollEnabled={true}
                  maxLength={1000}
                  onChangeText={(val) => saveExplanation(val)}
                  value={
                    !languageFlag
                      ? questionsList[key].explaination
                      : questionsList[key].explainationLang
                  }
                />
              </ElevatedView>
            </View>
          </View>
          <View
            flexDirection={'row'}
            style={{marginHorizontal: 20, justifyContent: 'space-between'}}>
            <View
              style={{
                paddingLeft: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {key ? (
                <TouchableOpacity
                  onPress={prevQuestion.bind(this, key)}
                  disabled={!validateQuiz()}>
                  <Icon
                    name="chevron-left"
                    style={{
                      color: validateQuiz() ? Constants.textColor1 : '#acc3f8',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    size={35}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
            {key ? (
              <View style={{justifyContent: 'center', alignContent: 'center'}}>
                <TouchableOpacity
                  onPress={deleteQuestion.bind(this, key)}
                  style={{
                    padding: 10,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundColor: '#de3500',
                  }}>
                  <Icon2 name="delete" style={{color: 'white'}} size={15} />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
            <View>
              {isSubmit ? (
                <View
                  style={{justifyContent: 'center', alignContent: 'center'}}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                <PButton
                  title={'Submit Test'}
                  onPress={() => submitTest()}
                  disable={!validateQuiz()}
                  viewStyle={{
                    backgroundColor: validateQuiz()
                      ? Constants.textColor1
                      : '#acc3f8',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              )}
            </View>
            <PButton
              title={key == questionsList.length - 1 ? 'Add' : 'Next'}
              onPress={nextQuestion.bind(this, key)}
              disable={!validateQuiz()}
              viewStyle={{
                backgroundColor: validateQuiz()
                  ? Constants.textColor1
                  : '#acc3f8',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
            />
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const renderProgressBar = (length, inFocus) => {
  let junctions = [];
  for (var i = 0; i < length; i++) {
    if (i === inFocus) {
      junctions.push({key: i, color: 'yellow'});
    } else {
      junctions.push({key: i, color: 'white'});
    }
  }
  return (
    <View
      style={{
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 10,
      }}>
      {junctions.map((j) => {
        return (
          <View
            key={j.key}
            style={{
              height: 7,
              width: (1 / length) * 100 + '%',
              backgroundColor: j.color,
              borderRadius: 4,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stayElevated: {
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  answerText: {
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  answerText2: {
    textAlign: 'left',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textArea: {
    color: Constants.textColor1,
    borderRadius: 5,
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
  textArea2: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    borderRadius: 5,
    width: '90%',
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
  },
  elevatedStyle: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  elevatedStyleTO: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TestAdmin;

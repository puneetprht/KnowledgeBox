/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';

const TestResult = (props) => {
  const {questionsList} = props.route.params;
  const [displaylist, setDisplayList] = useState(false);

  const correctAnswers = () => {
    let correct = 0;
    questionsList.forEach((element) => {
      if (element.selectedAnswer.toString() === element.correctOption) {
        correct += element.weightage;
      } else {
        correct -= element.negativeWeightage;
      }
    });
    return correct;
  };
  const calculateScore = () => {
    return parseFloat(
      (
        (correctAnswers() / questionsList[questionsList.length - 1].maxMarks) *
        100
      ).toFixed(2),
    );
  };
  const winnerStar = require('../../../assets/winnerStar.png');
  const winnerTrophy = require('../../../assets/winnerTrophy.png');

  const openDetail = (index, evt) => {
    props.navigation.navigate('VideoPlayback', {
      videoId: index,
      title: 'Solution',
    });
  };

  return (
    <ScrollView style={{marginBottom: 30}}>
      <View>
        <View style={{flex: 1, justifyContent: 'center', marginTop: 10}}>
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
              fontFamily: 'Roboto-Medium',
              fontSize: 22,
            }}>
            Result and Explanation
          </Text>
          <View style={{position: 'absolute', paddingLeft: 15}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('TestHome')}>
              <Icon name="chevron-left" size={35} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <LinearGradient
          colors={[
            Constants.gradientColorTheme1,
            Constants.gradientColorTheme2,
          ]}
          style={styles.scoreBox}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 22,
                color: 'white',
              }}>
              Your Score
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: 35,
                color: 'white',
              }}>
              {correctAnswers()}/
              {questionsList[questionsList.length - 1].maxMarks}
            </Text>
          </View>
          <View
            flexDirection="row"
            style={{marginHorizontal: 10, justifyContent: 'space-between'}}>
            <Image source={winnerStar} />
            <Image source={winnerStar} />
          </View>
          <View
            flexDirection="row"
            style={{marginTop: 40, justifyContent: 'center'}}>
            <Image source={winnerTrophy} style={{position: 'absolute'}} />
            <Text
              style={{
                marginTop: 10,
                fontFamily: 'Roboto-Medium',
                fontSize: 22,
                color: 'white',
                position: 'absolute',
              }}>
              {calculateScore()}%
            </Text>
            <View style={{margin: -30, position: 'absolute'}}>
              <AnimatedCircularProgress
                size={150}
                width={10}
                fill={parseInt(calculateScore())}
                rotation={360}
                tintColor="#ffffff"
                backgroundColor="#6b6b6b"
              />
            </View>
          </View>
        </LinearGradient>
        <View>
          <PButton
            title={!displaylist ? 'Check Answers' : 'Hide Answers'}
            onPress={() => setDisplayList(!displaylist)}
            viewStyle={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
          />
        </View>
      </View>
      <View style={{marginHorizontal: 20, marginTop: 15}}>
        {displaylist ? (
          questionsList.map((question) => {
            return (
              <ElevatedView
                key={question.id}
                elevation={5}
                style={{borderRadius: 15, marginBottom: 20, padding: 10}}>
                <Text
                  style={{
                    //margin: 10,
                    color: Constants.textColor1,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 18,
                    borderBottomColor: Constants.textColor1,
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                  }}>
                  {question.question}
                </Text>
                <Text
                  style={{
                    color: Constants.textColor1,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 16,
                  }}>
                  Time on question: {question.time} seconds
                </Text>
                <View style={{alignItems: 'center'}}>
                  {question.options.map((option) => {
                    return (
                      <View
                        key={option.id}
                        style={{
                          ...styles.stayElevated,
                          borderWidth: 3,
                          borderColor: option.isSelected
                            ? question.correctOption.includes(option.id)
                              ? Constants.success
                              : Constants.error
                            : 'white',
                        }}>
                        <ElevatedView elevation={2} style={{borderRadius: 10}}>
                          <Text
                            style={{
                              ...styles.answerText,
                              color: Constants.textColor1,
                            }}>
                            {option.value}
                          </Text>
                          {question.correctOption.includes(option.id) ? (
                            <Icon
                              name="check"
                              style={{
                                flex: 1,
                                marginTop: 12,
                                paddingLeft: 5,
                                color: Constants.success,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                                padding: 2,
                              }}
                              size={15}
                            />
                          ) : (
                            <View />
                          )}
                        </ElevatedView>
                      </View>
                    );
                  })}
                </View>
                {question.explaination ? (
                  <View>
                    <Text
                      style={{
                        color: Constants.textColor1,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 18,
                      }}>
                      Explanation: {question.explaination}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                {question.videoUrlId ? (
                  <View flexDirection="row">
                    <Text
                      style={{
                        color: Constants.textColor1,
                        fontFamily: 'Roboto-Medium',
                        fontSize: 18,
                        marginTop: 8,
                      }}>
                      Video Solution:{' '}
                    </Text>
                    <PButton
                      title="Watch"
                      onPress={openDetail.bind(this, question.videoUrlId)}
                      viewStyle={(styles.button, {marginLeft: 10})}
                      textStyle={{fontFamily: 'Roboto-Medium', fontSize: 16}}
                      elementStyle={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}
              </ElevatedView>
            );
          })
        ) : (
          <View />
        )}
      </View>
    </ScrollView>
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
    fontSize: 18,
    //fontWeight: 'bold',
    margin: 10,
  },
  scoreBox: {
    minHeight: 365,
    height: Dimensions.get('window').width * 0.85,
    width: Dimensions.get('window').width * 0.85,
    marginVertical: 15,
    borderRadius: 15,
  },
});

export default TestResult;

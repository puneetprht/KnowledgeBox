/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import axios from 'axios';

const QuizTopicList = props => {
  const [list, setList] = useState([]);
  const {subjectId, title, user, stateId} = props.route.params;

  useEffect(() => {
    fetchAllTopics();
  }, []);

  const fetchAllTopics = () => {
    axios
      .get('http://10.0.2.2:3000/quiz/getSubTopicList', {
        params: {
          id: subjectId,
        },
      })
      .then(response => {
        if (response.data) {
          setList(response.data);
        } else {
          setList([]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const openTopic = (index, evt) => {
    props.navigation.navigate('QuizList', {
      SubTopicId: index.id,
      title: index.value,
      user: user,
      stateId: stateId,
    });
  };

  return (
    <ContainerList
      title={title + ' topics'}
      onPress={() => props.navigation.goBack()}>
      <ScrollView style={{marginBottom: 30}}>
        <View style={styles.Container}>
          {list.map(l => {
            return (
              <View key={l.id} style={styles.boxSimple}>
                <View style={styles.boxLeft}>
                  <Text style={styles.textLeft}>{l.value}</Text>
                </View>
                <View style={styles.boxRight}>
                  <TouchableOpacity onPress={openTopic.bind(this, l)}>
                    <Text style={styles.textRight}>
                      {l.count > 1 ? l.count + ' Quizes' : l.count + ' Quiz'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
  textLeft: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuizTopicList;

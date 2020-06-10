import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../constants/constants';

const ContainerGradient = ({children}) => {
  return (
    <LinearGradient
      colors={[Constants.gradientColor1, Constants.gradientColor2]}
      style={styles.linearGradient}>
      <View style={styles.container}>{children}</View>
    </LinearGradient>
  );
};

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default ContainerGradient;

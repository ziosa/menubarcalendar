// @ts-nocheck
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, Linking, Button} from 'react-native';

import {Calendar} from 'react-native-calendars';
import ColorPalette from 'react-native-color-palette';
import {Icon} from 'react-native-elements';

const App: () => React$Node = () => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [bgTodayColor, setBgTodayColor] = React.useState('rgb(0,122,255)');

  const Arrow = ({direction}) => {
    console.log(direction);
    if (direction === 'left')
      return (
        <Icon name="ios-arrow-dropleft" type="ionicon" color={bgTodayColor} />
      );
    else
      return (
        <Icon name="ios-arrow-dropright" type="ionicon" color={bgTodayColor} />
      );
  };
  return (
    <View style={styles.body}>
      {!showSettings ? (
        <View>
          <Calendar
            renderArrow={direction => <Arrow direction={direction} />}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMMM yyyy'}
            // Hide month navigation arrows. Default = false
            hideArrows={false}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            firstDay={1}
            theme={{
              todayBackgroundColor: bgTodayColor,
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#ffffff',
              todayTextColor: '#ffffff',
              dayTextColor: '#ffffff',
              textDisabledColor: '#ffffff',
              dotColor: '#ffffff',
              selectedDotColor: '#ffffff',
              arrowColor: bgTodayColor,
              monthTextColor: '#ffffff',
              indicatorColor: 'white',
              textDayFontWeight: '300',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>
      ) : (
        <View>
          <View style={{padding: 50}}>
            <ColorPalette
              onChange={color => setBgTodayColor(color)}
              defaultColor={bgTodayColor}
              colors={[
                'rgb(0,122,255)',
                '#C0392B',
                '#E74C3C',
                '#9B59B6',
                '#8E44AD',
              ]}
              title={
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Change color
                </Text>
              }
            />
          </View>
        </View>
      )}
      <View style={styles.buttonSettings}>
        <Icon
          name={showSettings ? 'ios-arrow-dropleft' : 'ios-settings'}
          type="ionicon"
          color={bgTodayColor}
          onPress={() => setShowSettings(!showSettings)}
        />
      </View>
      <View style={styles.buttonGithub}>
        <OpenURLButton url="https://github.com/ziosa" />
      </View>
    </View>
  );
};

const OpenURLButton = ({url}) => {
  const handlePress = React.useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, [url]);

  return (
    <Icon
      name="logo-github"
      type="ionicon"
      color="#ffffff"
      onPress={handlePress}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    height: 400,
  },
  buttonSettings: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 10,
  },
  buttonGithub: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  },
});

export default App;

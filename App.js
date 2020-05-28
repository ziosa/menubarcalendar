// @ts-nocheck
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';

import {Calendar} from 'react-native-calendars';
import ColorPalette from 'react-native-color-palette';
import {Icon} from 'react-native-elements';

const App: () => React$Node = () => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [bgTodayColor, setBgTodayColor] = React.useState('rgb(0,122,255)');
  const [today, setToday] = React.useState(new Date());
  const now = new Date();
  const delay = 86400000; // 1 day in ms
  const startDelay =
    delay -
    (now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()) *
      1000 +
    now.getMilliseconds();

  console.disableYellowBox = true;

  const Arrow = ({direction}) => {
    if (direction === 'left') {
      return (
        <Icon name="ios-arrow-dropleft" type="ionicon" color={bgTodayColor} />
      );
    } else {
      return (
        <Icon name="ios-arrow-dropright" type="ionicon" color={bgTodayColor} />
      );
    }
  };

  React.useEffect(() => {
    setTimeout(function updateToday() {
      setToday(new Date());
      setTimeout(updateToday, delay);
    }, startDelay);

    return () => clearTimeout();
  }, []);

  return (
    <View style={styles.body} key={today}>
      {!showSettings ? (
        <View>
          <Calendar
            renderArrow={direction => <Arrow direction={direction} />}
            monthFormat={'MMMM yyyy'}
            hideArrows={false}
            hideExtraDays={true}
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
              title={<Text style={styles.changeColor}>Change color</Text>}
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
        <OpenURLButton url="https://github.com/ziosa/menubarcalendar" />
      </View>
      <View style={styles.madeWithLove}>
        <Text style={styles.titleText}>Made with </Text>
        <Icon name="ios-heart" type="ionicon" color="red" size={10} />
        <Text style={styles.titleText}> by @ziosa</Text>
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
  madeWithLove: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    bottom: 5,
    left: 140,
    opacity: 0.5,
  },
  titleText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  changeColor: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;

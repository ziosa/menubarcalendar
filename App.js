// @ts-nocheck
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {Calendar} from 'react-native-calendars';
import ColorPalette from 'react-native-color-palette';
import {Icon} from 'react-native-elements';

const App: () => React$Node = () => {
  const RNEventEmitter = NativeModules.RNEventEmitter;
  const RTVEventEmitter = new NativeEventEmitter(RNEventEmitter);

  const [showSettings, setShowSettings] = React.useState(false);
  const [bgTodayColor, setBgTodayColor] = React.useState('rgb(0,122,255)');
  const [today, setToday] = React.useState(new Date());
  const [events, setEvents] = React.useState({
    '0': {
      calendarColor: '0,122,255',
      eventTitle: 'Nothing to do!',
    },
  });

  RTVEventEmitter.addListener('onReady', result => {
    setEvents(result.data);
  });

  RTVEventEmitter.addListener('updateTodayDate', () => {
    setToday(new Date().toString());
  });

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

  const circle = function(color) {
    return {
      top: 14,
      width: 10,
      height: 10,
      borderRadius: 100 / 2,
      backgroundColor: `rgb(${color})`,
    };
  };
  return (
    <View style={styles.body}>
      {!showSettings ? (
        <View>
          <Calendar
            key={today}
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
          {events && (
            <ScrollView
              style={styles.scrollViewEvents}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.todayEvents}>
                <Text style={styles.todayText}>Today events:</Text>
                {Object.values(events).map(event => (
                  <View>
                    <View style={circle(event.calendarColor)} />
                    <Text
                      style={{
                        paddingLeft: 15,
                        textAlign: 'left',
                        color: 'gray',
                      }}>
                      {event.eventTitle}
                    </Text>
                    <Text
                      style={{
                        fontSize: 25,
                        padding: 15,
                        textAlign: 'center',
                      }}>
                      &#128640;
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
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
    height: 600,
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
  todayEvents: {
    borderColor: 'rgb(31,32,35)',
    backgroundColor: 'rgb(31,32,35)',
    borderWidth: 2,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 240,
  },
  todayText: {
    fontSize: 20,
    color: 'white',
    padding: 10,
  },
  scrollViewEvents: {
    height: 240,
    overflow: 'hidden',
  },
});

export default App;

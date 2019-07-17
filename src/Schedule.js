import React, {Component} from 'react'
import {ActivityIndicator, Image, ScrollView, TouchableHighlight, TouchableOpacity, StyleSheet, Text, View} from 'react-native'
import { createStackNavigator } from 'react-navigation'
import Pager from './Pager'
import { colors, typography, dimensions } from './theme'

import { API, graphqlOperation } from 'aws-amplify'
import { listTalks } from './graphql/queries'

const logo = require('./assets/logo.jpg')

const day1 = 'November 10'
const day2 = 'November 11'

class Schedule extends Component {
  static navigationOptions = props => ({
    headerLeft: <Image
        source={logo}
        resizeMode='contain'
        style={styles.logo}
      />
  })
  state = {
    talks: [],
    date: day1,
    loading: true
  }
  toggleDate = date => {
    this.setState({ date })
  }
  async componentDidMount() {
    try {
      const talkData = await API.graphql(graphqlOperation(listTalks))
      this.setState({ talks: talkData.data.listTalks.items, loading: false })
    } catch (err) {
      console.log('err: ', err)
      this.setState({ loading: false })
    }
  }
  render() {
    const { talks, date, loading } = this.state
    const tab1 = talks.filter((t) => t.date === day1)
    const tab2 = talks.filter((t) => t.date === day2)
    let talkData = (this.state.date == day1 ? tab1 : tab2)
      .sort((a, b) => new Date(parseInt(a.timeStamp)) - new Date(parseInt(b.timeStamp)))
    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.listContainer}>
          {
            talkData.map((talk, i) => (
              <TouchableOpacity
                key={i} 
                onPress={
                  () => this.props.navigation.push('Talk', talk)
                }
              >
                <View style={styles.talk}>
                  <View style={styles.speakerContainer}>
                    <View style={styles.avatarContainer}>
                      <Image
                        style={styles.avatar}
                        resizeMode='cover'
                        source={{ uri: talk.speakerAvatar }}
                      />
                    </View>
                    <View style={styles.infoContainer}>
                      <Text
                        style={styles.name}
                      >{talk.name}</Text>
                      <Text style={styles.speakerName}>{talk.speakerName}</Text>
                    </View>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.talkTime}>{talk.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          }
          </View>
        </ScrollView>
        <View style={styles.tabBottomContainer}>
          <TouchableHighlight
            underlayColor={colors.primaryDark}
            onPress={() => this.toggleDate(day1)}
          >
            <View style={[getButtonStyle(day1, date), styles.bottomButton]}>
              <Text style={[styles.bottomButtonText]}>November 10</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.primaryDark}
            onPress={() => this.toggleDate(day2)}
          >
            <View style={[getButtonStyle(day2, date), styles.bottomButton]}>
              <Text style={[styles.bottomButtonText]}>November 11</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

function getButtonStyle(day, currentDay) {
  const backgroundColor = day === currentDay ? colors.primary2 : colors.primary
  const borderTopColor = day === currentDay ? colors.highlight : colors.primary
  return { backgroundColor, borderTopColor }
}

const ScheduleNav = createStackNavigator({
  Schedule: { screen: Schedule },
  Talk: { screen: Pager }
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: colors.primary,
      borderBottomColor: colors.primary2,
      borderBottomWidth: 1
    },
  }
})

export default ScheduleNav

const styles = StyleSheet.create({
  bottomButton: {
    width: dimensions.width / 2,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1
  },
  bottomButtonText: {
    color: colors.highlight,
    fontFamily: typography.primary,
  },
  tabBottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    width: dimensions.width,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "rgba(255, 255, 255, .2)",
    borderBottomColor: "rgba(255, 255, 255, .2)",
    left: 0, 
    bottom: -1
  },
  listContainer: {
    paddingBottom: 70,
  },
  speakerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 10
  },
  logo: {
    marginLeft: 10,
    marginBottom: 4,
    width: 120,
    height: 35
  },
  container: {
    backgroundColor: colors.primary2,
    flex: 1
  },
  loading: {
    backgroundColor: colors.primary2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  talk: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    margin: 15,
    marginBottom: 0,
    paddingTop: 15,
    paddingBottom: 0,
  },
  timeContainer: {
    backgroundColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: colors.primaryDark
  },
  timeHeading: {
    fontWeight: "bold",
    color: 'white',
    fontFamily: typography.primary,
  },
  talkTime: {
    color: 'white',
    fontFamily: typography.primary,
  },
  infoContainer: {
    flex: 8,
    paddingLeft: 20
  },
  name: {
    fontWeight: "bold",
    fontFamily: typography.primary,
    fontSize: 17,
    marginBottom: 5,
    color: 'white'
  },
  avatarContainer: {
    flex: 2,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  avatar: {
    width: 60,
    height: 70,
  },
  speakerName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, .8)',
    fontFamily: typography.primary,
  }
});

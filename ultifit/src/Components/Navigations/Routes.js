import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  View, Image } from 'react-native';
import { getHeaderTitle } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';

import Login from './../../Pages/Login/Login';
import Register from './../../Pages/Register/Register';

import Home from './../../Pages/Home/Home';
import Session from './../../Pages/Exercise/Session';
import Food from './../../Pages/Food/Food';
import Account from './../../Pages/Account/Account';
import Summary from './../../Pages/Summary/Summary';
import AppHeader from './../AppHeader/AppHeader';
import UserInfo from '../../Pages/UserInfo/UserInfo';

export default function Routes() {
    const user = useSelector((state) => state.user.user)
    const Tab = createBottomTabNavigator();
    const RootStack = createStackNavigator()
    return (
      <NavigationContainer>
        {
          !user

          ?  
            <Tab.Navigator 
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { display: 'none'}
              })}
            >
              <Tab.Screen name="Login" component={Login} />
              <Tab.Screen name="Register" component={Register} />
              <Tab.Screen name="UserInfo" component={UserInfo} />
            </Tab.Navigator >

          :
            ( user?.name ?
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarStyle: { 
                  height: 60, 
                  shadowColor: "#000",
                  shadowOffset: {
                      width: 0,
                      height: 10,
                  },
                  shadowOpacity: 0.2,
                  elevation: 8, 
                },
                tabBarIcon: ({ focused, color, size }) => {
                  let iconUrl = require('../../../assets/icon-target-focused.png')
                  if (route.name === 'Home') {
                    iconUrl = focused
                    ? require('../../../assets/icon-home-focused.png')
                    :  require('../../../assets/icon-home.png')
                  } 
                  else if (route.name === 'Summary') {
                    iconUrl = focused
                    ? require('../../../assets/icon-chart-focused.png')
                    :  require('../../../assets/icon-chart.png')
                  }
                  else if (route.name === 'Exercise') {
                    iconUrl = focused
                    ? require('../../../assets/icon-target-focused.png')
                    :  require('../../../assets/icon-target.png')
                  } 
                  else if (route.name === 'Food') {
                    iconUrl = focused
                    ? require('../../../assets/icon-palette-focused.png')
                    :  require('../../../assets/icon-palette.png')
                  }
                  else if (route.name === 'Account') {
                    iconUrl = focused
                    ? require('../../../assets/icon-user-focused.png')
                    :  require('../../../assets/icon-user.png')
                  }
                  return(
                      <View>
                        <Image source={iconUrl} style={iconUrl = focused ? { width: 40, height: 40 } : { width: 32, height: 32 }} />
                      </View>
                  )
                },
                tabBarShowLabel:false,

                header: ({ navigation, route, options }) => {
                  const title = getHeaderTitle(options, route.name);
                
                  return (
                    <AppHeader title={title} />
                  );
                }
                
              })}
          >
            
              <Tab.Screen name="Home" component={Summary} />
              <Tab.Screen name="Exercise" component={Session} />
              <Tab.Screen name="Food" component={Food} />
              <Tab.Screen name="Account" component={Account} options={{title: user.name}} />

            </Tab.Navigator> : //use for not enter info
              <Tab.Navigator 
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { display: 'none'}
              })}
            >
              <Tab.Screen name="UserInfo" component={UserInfo} />
            </Tab.Navigator >
            )
        }
      </NavigationContainer>
    );
  }
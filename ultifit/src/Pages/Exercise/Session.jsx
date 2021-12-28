import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SessionsScreen from './Screen/SessionsScreen';
import ExercisesScreen from './Screen/ExercisesScreen';


function Session({ navigation, route }) {

    const TopTab = createMaterialTopTabNavigator()
    return (
        <TopTab.Navigator screenOptions={({ route }) => ({
            tabBarPressColor: '#DAF1FF',
            tabBarIndicatorStyle: { backgroundColor: '#9FDAFE', height: 3 },
            tabBarLabelStyle: { fontSize: 18, fontWeight: '600', textTransform: 'capitalize', },
            tabBarStyle: { shadowColor: 'white' },
            tabBarItemStyle: { fontSize: '1px' },

        })}
        //swipeEnabled={false}
        >
            <TopTab.Group>
                <TopTab.Screen name="SessionsScreen" component={SessionsScreen} options={{ title: 'Sessions' }} />
                <TopTab.Screen name="ExercisesScreen" component={ExercisesScreen} options={{ title: 'Exercises' }} />
            </TopTab.Group>
        </TopTab.Navigator >

    );
}

export default Session;


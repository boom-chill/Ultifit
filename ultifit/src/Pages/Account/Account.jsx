import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux';
import { addUser, deleteUser } from '../../features/user/user'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import AccountScreen from './Screen/AccountScreen';
import FriendsScreen from './Screen/FriendsScreen';
import HistoriesScreen from './Screen/HistoriesScreen';


function Account({ navigation }) {
    const TopTab = createMaterialTopTabNavigator()
    return (
        <TopTab.Navigator screenOptions={({ route }) => ({
            tabBarPressColor: '#DAF1FF',
            tabBarIndicatorStyle: { backgroundColor: '#9FDAFE', height: 3 },
            tabBarLabelStyle: { fontSize: 18, fontWeight: '600', textTransform: 'capitalize', },
            tabBarStyle: { shadowColor: 'white' },
        })} >
            <TopTab.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
            {/* <TopTab.Screen name="FriendsScreen" component={FriendsScreen} options={{ title: 'Friends' }} /> */}
            <TopTab.Screen name="HistoryScreen" component={HistoriesScreen} options={{ title: 'Histories' }} />

        </TopTab.Navigator>

    );
}

export default Account;

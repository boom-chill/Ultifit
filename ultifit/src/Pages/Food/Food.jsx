import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FoodsScreen from './Screen/FoodsScreen';
import IngredientsScreen from './Screen/IngredientsScreen';
import CreateFoodScreen from './Screen/CreateFoodScreen';


function Food({ navigation, route }) {

    const TopTab = createMaterialTopTabNavigator()
    return (
        <TopTab.Navigator screenOptions={({ route }) => ({
            tabBarPressColor: '#DAF1FF',
            tabBarIndicatorStyle: { backgroundColor: '#9FDAFE', height: 3 },
            tabBarLabelStyle: { fontSize: 18, fontWeight: '600', textTransform: 'capitalize', },
            tabBarStyle: { shadowColor: 'white' },
            tabBarItemStyle: { fontSize: '1px' },

        })}
        // swipeEnabled={false}
        >
            <TopTab.Group>
                <TopTab.Screen name="FoodsScreen" component={FoodsScreen} options={{ title: 'Foods' }} />
                <TopTab.Screen name="IngredientsScreen" component={IngredientsScreen} options={{ title: 'Ingredients' }} />
            </TopTab.Group>
        </TopTab.Navigator >

    );
}

export default Food;

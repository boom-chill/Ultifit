import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FoodsScreen from './Screen/FoodsScreen';
import IngredientsScreen from './Screen/IngredientsScreen';
import { useSelector, useDispatch } from 'react-redux';
import NotFoundPremium from './Screen/NotFoundPremium';


function Food({ navigation, route }) {

    const user = useSelector((state) => state.user.user)

    const TopTab = createMaterialTopTabNavigator()
    return (
        <TopTab.Navigator screenOptions={({ route }) => ({
            tabBarPressColor: '#DAF1FF',
            tabBarIndicatorStyle: { backgroundColor: '#9FDAFE', height: 3 },
            tabBarLabelStyle: { fontSize: 18, fontWeight: '600', textTransform: 'capitalize', },
            tabBarStyle: { shadowColor: 'white', display: !user.premium ? 'none' : 'flex' },
            tabBarItemStyle: { fontSize: '1px' },
        })}
        //swipeEnabled={false}
        >
            {
                user.premium ?
                    <TopTab.Group>
                        <TopTab.Screen name="FoodsScreen" component={FoodsScreen} options={{ title: 'Foods' }} />
                        <TopTab.Screen name="IngredientsScreen" component={IngredientsScreen} options={{ title: 'Ingredients' }} />
                    </TopTab.Group> :
                    <TopTab.Group>
                        <TopTab.Screen name="NotFoundPremium" component={NotFoundPremium} options={{ title: 'You need to be a premium member' }} />
                    </TopTab.Group>
            }
        </TopTab.Navigator >

    );
}

export default Food;

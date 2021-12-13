import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '../../Pages/Account/Account';
import Exercise from '../../Pages/Exercise/Exercise';
import Food from '../../Pages/Food/Food';
import Home from '../../Pages/Home/Home';
import Summary from '../../Pages/Summary/Summary';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BottomNavbar(props) {

    const navigation = useNavigation();
    return (
        <View style={styles.bottomNavbarWrapper}>

            <TouchableOpacity
                style={{ width: '20%' }}
                onPress={() => navigation.navigate('Home')}
            >
                <View style={styles.navBarItem}>
                    <Text>
                        Home
                    </Text>
                </View>
            </TouchableOpacity>


            <TouchableOpacity
                style={{ width: '20%' }}
                onPress={() => navigation.navigate('Summary')}
            >
                <View style={styles.navBarItem}>
                    <Text>
                        Summary
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '20%' }}
                onPress={() => navigation.navigate('Exercise')}
            >
                <View style={styles.navBarItem}>
                    <Text>
                        Exercise
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '20%' }}
                onPress={() => navigation.navigate('Food')}
            >
                <View style={styles.navBarItem}>
                    <Text>
                        Food
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '20%' }}
                onPress={() => navigation.navigate('Account')}
            >
                <View style={styles.navBarItem}>
                    <Text>
                        Account
                    </Text>
                </View>
            </TouchableOpacity>

            {/* <View>
                <Button
                    //style={styles.navBarItem}
                    title='Home'
                    onPress={() => navigation.navigate('Home')}
                />
            </View>

            <View style={{ width: '20%' }}>
                <Button
                    title='Summ'
                    onPress={() => navigation.navigate('Summary')}
                />
            </View>

            <View style={{ width: '20%' }}>
                <Button
                    title='Exer'
                    onPress={() => navigation.navigate('Exercise')}
                />
            </View>

            <View style={{ width: '20%' }}>
                <Button
                    title='Food'
                    onPress={() => navigation.navigate('Food')}
                />
            </View>

            <View style={{ width: '20%' }}>
                <Button
                    title='Acco'
                    onPress={() => navigation.navigate('Account')}
                />
            </View> */}
        </View >


    );
}

const styles = StyleSheet.create({
    bottomNavbarWrapper: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 60,
    },

    navBarItem: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
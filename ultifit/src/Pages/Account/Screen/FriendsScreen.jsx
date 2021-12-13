import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function FriendsScreen() {
    return (
        <View style={styles.container}>
            <Text>This site is being developed</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})
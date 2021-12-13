import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function Exercise(props) {
    return (
        <View style={styles.container}>
            <Text>Exercise</Text>
        </View>
    )
}

export default Exercise

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})


import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function CreateFoodScreen({ navigation, route }) {
    console.log("🚀 ~ file: CreateFood.jsx ~ line 5 ~ CreateFood ~ route", route)

    return (
        <View>
            <Text>
                Create Food
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({})

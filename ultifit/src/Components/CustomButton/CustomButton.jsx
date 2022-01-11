import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

export default function CustomButton(props) {
    let { type, title, buttonColor, buttonStyle, titleStyle, onPress, width, height, borderRadius, containerStyle, fontSize } = props

    if (buttonColor == 'blue') {
        buttonColor = '#C4E8FF'
    }
    else if (buttonColor == 'red') {
        buttonColor = '#FF9C94'
    }
    else if (buttonColor == 'purple') {
        buttonColor = '#F0D3FF'
    }
    else if (buttonColor == 'gray') {
        buttonColor = '#E9E9E9'
    }
    else if (buttonColor == 'yellow') {
        buttonColor = '#FEEDC1'
    }

    if (!borderRadius) {
        borderRadius = 12
    }

    return (
        <View style={{ width: '100%', ...styles.button, ...containerStyle }}>
            <Pressable
                onPress={onPress}
                type={type}
                style={{ width: width, height: height, borderRadius: borderRadius, backgroundColor: buttonColor, ...buttonColor, ...styles.button, ...buttonStyle }}
            >
                <Text
                    style={{ ...titleStyle, fontSize }}
                >
                    {title}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

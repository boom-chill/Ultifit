import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

export default function NotFoundPremium() {
    return (
        <View style={{
            ...styles.container, ...styles.middleCol
        }}>
            <View style={{ width: '100%', ...styles.middleCol }}>

                <View style={{ ...styles.middleRow, width: '70%', borderRadius: 10, borderLeftColor: 'white', position: 'relative', backgroundColor: '#FFD02B', padding: 16 }}>

                    <View style={{ width: '100%', ...styles.middleCol }} >
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>
                            You need to be a premium member to use this feature
                        </Text>
                        <View style={{ position: 'absolute', top: -43, right: -34, transform: [{ rotate: '24deg' }] }}>

                            <Image
                                source={require('../../../../assets/premium-crown.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>

                        <View style={{ position: 'absolute', bottom: -43, left: -34, transform: [{ rotate: '204deg' }] }}>

                            <Image
                                source={require('../../../../assets/black-normal-crown.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>
                    </View>


                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    middleCol: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

})

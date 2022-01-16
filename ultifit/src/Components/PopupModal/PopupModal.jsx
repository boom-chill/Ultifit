import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity, Modal, TextInput, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../CustomButton/CustomButton'

import { Video, AVPlaybackStatus } from 'expo-av';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'


export default function PopupModal({ isOpen, children, setIsOpen }) {

    const [showModal, setShowModal] = React.useState(isOpen)

    React.useEffect(() => {
        if (isOpen) {
            setShowModal(true)
        } else {
            setShowModal(false)
        }
    }, [isOpen])

    return (
        <Modal
            animationType="fade"
            transparent
            visible={showModal}
            statusBarTranslucent={true}
        >
            <View style={{
                ...styles.modalBackground, ...styles.middleCol
            }}
            >
                <View style={{
                    ...styles.modalContainer, ...styles.middleCol
                }}>

                    <TouchableOpacity
                        onPress={() => { setShowModal(false); setIsOpen(false) }}
                        style={{ ...styles.middleRow, justifyContent: 'flex-end', position: 'absolute', top: 15, right: 15 }}
                    >
                        <View >
                            <Image source={
                                require('../../../assets/icon-close.png')
                            }
                                style={{ width: 24, height: 24 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ marginTop: 20, }}>
                        {children}
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        paddingHorizontal: 5,
        paddingVertical: 30,
        borderRadius: 12,
        height: 'auto',
        width: '80%',
        backgroundColor: 'white',
    },

    middleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    middleCol: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity, Modal, TextInput, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from './../../../Components/CustomButton/CustomButton';
import { closeStartSession, deleteStartSession } from '../../../features/session/session';
import { Video, AVPlaybackStatus } from 'expo-av';
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { formatNumber } from '../../../utils/kFormatter';
import PopupModal from '../../../Components/PopupModal/PopupModal';
import axios from 'axios'
import { addHistories } from '../../../features/histories/histories';

export default function StartExerciseModal() {

    const session = useSelector((state) => state.session.startSession)
    const isOpen = useSelector((state) => state.session.openStartSession)
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const [seri, setSeri] = React.useState(0)
    const [isPractice, setIsPractice] = React.useState(false)
    const [isOpenPopup, setIsOpenPopup] = React.useState(false)
    const [isReady, setIsReady] = React.useState(false)

    const cancelEx = () => {
        setSeri(0)
        setIsPractice(false)
        dispatch(deleteStartSession())
        dispatch(closeStartSession())
    }

    const SessionComplete = (exercise) => {
        const dataSend = {
            _sessionID: exercise._id,
            time: Date.now(),
            type: 'session',
            author: user.username,
            calories: exercise.caloriesBurn,
            totalTime: exercise.totalTime,
            name: exercise.name
        }

        try {
            axios.post(`${baseUrl}/api/histories`, dataSend, {
                params: {
                    username: user.username,
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        dispatch(addHistories(resData))
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const changeEx = () => {
        if (session.exercises.length - 1 > seri) {
            setIsPractice(!isPractice)
            if (isPractice) {
                setSeri(seri + 1)
            }
        } else if (session.exercises.length - 1 == seri && isPractice) {
            setIsOpenPopup(true)
            SessionComplete(session)
            cancelEx()
            setTimeout(() => {
                setIsOpenPopup(false)
            }, 3000)
        } else if (session.exercises.length - 1 == seri && !isPractice) {
            setIsPractice(!isPractice)
        }
    }

    const children = (remainingTime) => {
        const minutes = (Number(Math.floor((remainingTime % 3600) / 60))).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
        const seconds = (Number(remainingTime % 60)).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

        return `${minutes}:${seconds}`
    }


    return (
        <View style={{ ...styles.middleCol }}>
            <PopupModal isOpen={isOpenPopup} >
                {
                    <View style={{ ...styles.middleCol }}>
                        <Image source={
                            require('../../../../assets/success.png')
                        }
                            style={{ width: 150, height: 150 }}
                        />
                        <Text style={{ fontWeight: '700', marginTop: 30, fontSize: 18 }}>
                            Congratulations your session completed!
                        </Text>
                    </View>
                }
            </PopupModal>
            <Modal
                animationType="fade"
                transparent={false}
                visible={isOpen}
                onRequestClose={() => {
                    cancelEx()
                }}
                statusBarTranslucent={true}
            >

                <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', paddingTop: 30, ...styles.middleCol, marginTop: 60 }} >

                    <ScrollView  >
                        <View style={styles.headerWrapper}>
                            {
                                isPractice ?
                                    <View style={{ backgroundColor: '#FCDEDE', borderRadius: 10, height: 42, paddingLeft: 12, paddingRight: 12, ...styles.middleRow }}>
                                        <Text style={{ ...styles.headerText, color: '#C11414', fontSize: 30 }}>
                                            Practice time
                                        </Text>
                                    </View>
                                    : <View style={{ backgroundColor: '#D6FFD6', borderRadius: 10, height: 42, paddingLeft: 12, paddingRight: 12, ...styles.middleRow }}>
                                        <Text style={{ ...styles.headerText, color: '#337732', fontSize: 30 }}>
                                            {seri == 0 ? 'Ready' : 'Rest time'}
                                        </Text>
                                    </View>
                            }
                        </View>

                        <View style={{ ...styles.container }}>

                            {
                                session?.exercises ?
                                    <View style={{ ...styles.middleRow, zIndex: 100, height: 210 }}>
                                        <View style={styles.container}>
                                            <Video
                                                style={{ width: '95%', height: '100%', borderRadius: 10 }}
                                                source={{
                                                    uri: `${baseUrl}/${session?.exercises[seri]?.video}`,
                                                }}
                                                ratio={16 / 9}
                                                resizeMode="cover"
                                                isLooping
                                                isMuted={true}
                                                shouldPlay
                                            />
                                        </View>
                                    </View>
                                    : <View></View>
                            }
                        </View>

                        <View style={styles.headerWrapper}>
                            {
                                isPractice && session?.exercises ?
                                    <View style={{ paddingLeft: 12, paddingRight: 12, ...styles.middleRow, }}>
                                        <Text style={{ fontSize: 24, marginRight: 3 }}>
                                            {
                                                session?.exercises[seri]?.name ?? ''
                                            }
                                        </Text>

                                        <Image source={
                                            require('../../../../assets/icon-red-fire.png')
                                        }
                                            style={{ width: 24, height: 24 }}
                                        />

                                    </View>
                                    :
                                    <View style={{ ...styles.middleRow }}>

                                        <View style={{ backgroundColor: '#59A458', borderRadius: 5, paddingLeft: 8, paddingRight: 8, ...styles.middleRow, marginRight: 8 }}>
                                            <Text style={{ color: 'white', fontSize: 22 }}>
                                                {seri == 0 ? 'First' : 'Next'}
                                            </Text>

                                        </View>

                                        <Text style={{ fontSize: 24, marginRight: 3 }}>
                                            {
                                                session?.exercises[seri]?.name ?? ''
                                            }
                                        </Text>

                                        <Image source={
                                            require('../../../../assets/icon-green-heartbeat.png')
                                        }
                                            style={{ width: 24, height: 24 }}
                                        />

                                    </View>
                            }
                        </View>

                        <View style={{ ...styles.container }}>

                            {
                                <View style={{ ...styles.middleRow, zIndex: 100, height: 210 }}>
                                    <CountdownCircleTimer
                                        key={isPractice || seri}
                                        isPlaying
                                        duration={isPractice ? Number(session.practiceTime) : (seri == 0 ? 5 : Number(session.restTime))}
                                        onComplete={() => {
                                            changeEx()
                                            return [true]
                                        }}
                                        colors={isPractice ? '#C11414' : '#337732'}
                                        rotation='clockwise'
                                    >
                                        {({ remainingTime, animatedColor }) => (
                                            <Animated.Text style={{ color: animatedColor, fontSize: 48 }}>
                                                {remainingTime == 1 && !isPractice ? 'GO' : remainingTime}
                                            </Animated.Text>
                                        )}
                                    </CountdownCircleTimer>
                                </View>
                            }
                        </View>





                        <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', }} >
                            <ScrollView  >

                                <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 16 }}>
                                    <CustomButton
                                        title='Cancel'
                                        buttonColor='yellow'
                                        width={'60%'}
                                        titleStyle={{ color: '#D0810B' }}
                                        height={40}
                                        borderRadius={12}
                                        fontSize={24}
                                        onPress={() => cancelEx()}
                                    />
                                </View>

                            </ScrollView>
                        </SafeAreaView >
                    </ScrollView>
                </SafeAreaView>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 10,
    },

    itemContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: 90,
        borderColor: '#C4C4C4',
        borderWidth: 1,
        width: '96%',
        borderRadius: 10,
        padding: 9,
        marginBottom: 10,
        backgroundColor: 'white',
        position: 'relative'
    },

    itemFrontContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 70,
        width: '100%',

        backgroundColor: 'white',
        position: 'relative'
    },

    chooseButtonContainer: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 1,
        elevation: 8,

    },

    chooseButtonWrapper: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingTop: 10,

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

    headerWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 12,
        marginRight: 12,
        height: 70
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#121212',
    },
})
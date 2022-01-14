import axios from 'axios'
import React, { useState } from 'react'
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from './../../../Components/CustomButton/CustomButton';
import { Input } from '../../../Components/Input/Input';
import { useForm } from "react-hook-form";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { kFormatter } from '../../../utils/kFormatter';
import { convertTZ } from '../../../utils/convertTZ';
import { updateFoodsHistories } from '../../../features/user/user';
import { addHistories } from '../../../features/histories/histories';
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';



export default function HistoriesScreen() {
    const user = useSelector((state) => state.user.user)
    const histories = useSelector((state) => state.history.histories)

    const dispatch = useDispatch()

    const [chooseMode, setChooseMode] = React.useState(false)

    const [historiesDelete, setHistoriesDelete] = React.useState('')

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const handleChooseMode = () => {
        setChooseMode(!chooseMode)
    }

    const handleItemChooseChange = (idx) => {
        let newFoods = [...histories]

        newFoods[idx] = {
            ...newFoods[idx],
            isChoose: !newFoods[idx]?.isChoose ?? true
        }

        dispatch(addHistories(newFoods))
    }

    React.useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/histories`, {
                params: {
                    username: user.username
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

        }
    }, [])

    const handleUpdateHistories = (history, time) => {
        try {
            axios.patch(`${baseUrl}/api/histories/${history._id}`, {
                time: time
            }, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        dispatch(addHistories(resData))
                        setChooseMode(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleHistoryDelete = () => {
        try {
            axios.delete(`${baseUrl}/api/histories/${historiesDelete}`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        dispatch(addHistories(resData))
                        setChooseMode(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleHistoryEdit = (time, history) => {
        try {
            axios.patch(`${baseUrl}/api/histories/${history._id}`, {
                time: time
            }, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        dispatch(addHistories(resData))
                        setChooseMode(false)
                        hideDatePicker()
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleNoticeHistoryDelete = (history) => {
        setHistoriesDelete(history._id)
        setChooseMode(true)
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    return (
        <View style={{ width: '100%' }}>

            <View style={{ ...styles.chooseButtonContainer, width: '100%' }}>
                {
                    chooseMode
                        ? <View style={{ ...styles.chooseButtonWrapper }}>
                            <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%' }}>
                                <CustomButton
                                    title='Delete'
                                    buttonColor='red'
                                    width={'45%'}
                                    height={40}
                                    borderRadius={12}
                                    fontSize={14}
                                    onPress={() => handleHistoryDelete()}
                                />

                                <CustomButton
                                    title='Cancel'
                                    buttonColor='gray'
                                    width={'45%'}
                                    height={40}
                                    borderRadius={12}
                                    fontSize={14}
                                    onPress={() => handleChooseMode()}
                                />
                            </View>
                        </View>
                        : <View></View>
                }
            </View>

            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', ...(chooseMode ? { paddingBottom: 120 } : { paddingBottom: 0 }) }} >
                <ScrollView

                >
                    <View style={{ ...styles.container }}>

                        {
                            histories.map((history, idx) => (
                                <TouchableHighlight
                                    key={idx}
                                    onPress={() => {
                                        handleItemChooseChange(idx)
                                        setChooseMode(false)
                                    }}
                                    style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                    underlayColor='white'
                                >
                                    <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                                        <View
                                            style={{ ...styles.itemContainer, ...(history.isChoose ? { height: 140 } : { height: 90 }) }}
                                        >
                                            <View
                                                style={{ ...styles.itemFrontContainer }}
                                            >
                                                {
                                                    history.type == 'food'

                                                        ? <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#C4C4C4', marginRight: 8, ...styles.middleCol }}>
                                                            <Image
                                                                source={{ uri: `${baseWideUrl}/${history?.thumbnail ? history.thumbnail : 'file/foods/dinner-temp.png'}` }}
                                                                style={history?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                            />
                                                        </View>
                                                        : <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFEBEA', marginRight: 8, ...styles.middleCol }}>
                                                            <Image
                                                                source={{ uri: `${baseWideUrl}/${history?.thumbnail ? history.thumbnail : 'file/exercises/session-temp.png'}` }}
                                                                style={history?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                            />
                                                        </View>
                                                }
                                                <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-around', height: '94%' }}>
                                                    <View>
                                                        <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 240 }} numberOfLines={1} ellipsizeMode='tail'>
                                                            {
                                                                history.name
                                                            }
                                                        </Text>
                                                    </View>

                                                    {
                                                        history.type == 'food'
                                                            ?
                                                            (
                                                                <View style={{ ...styles.middleRow }}>

                                                                    <View>
                                                                        {/* <Text style={{ color: '#727272' }} >
                                                                            Fat: {kFormatter(history.fat)}g
                                                                        </Text> */}
                                                                        <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                            <Image source={
                                                                                require('../../../../assets/icon-fork.png')
                                                                            }
                                                                                style={{ width: 15, height: 15 }}
                                                                            />
                                                                            {kFormatter(history.calories)}cal
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                            :
                                                            (
                                                                <View style={{ ...styles.middleRow, }}>

                                                                    <View style={{ width: 80, }}>

                                                                        <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                            <Image source={
                                                                                require('../../../../assets/icon-ex-fire.png')
                                                                            }
                                                                                style={{ width: 15, height: 15 }}
                                                                            />
                                                                            {parseFloat(history.calories).toFixed(0)} cal
                                                                        </Text>
                                                                    </View>

                                                                    <View style={{ width: 80, }}>



                                                                        <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                            <Image source={
                                                                                require('../../../../assets/icon-ex-clock.png')
                                                                            }
                                                                                style={{ width: 15, height: 15 }}
                                                                            />
                                                                            {history.totalTime > 60 ? parseFloat(history.totalTime / 60).toFixed(0) + 'min' : parseFloat(history.totalTime).toFixed(0) + 's'}
                                                                        </Text>

                                                                    </View>

                                                                </View>
                                                            )
                                                    }


                                                </View>
                                                <View style={{ position: 'absolute', top: -8, right: -1 }} >
                                                    <Text style={{ fontSize: 12, color: '#727272' }}>
                                                        {
                                                            convertTZ(history.time, "Asia/Jakarta")
                                                        }
                                                    </Text>
                                                </View>


                                            </View>

                                            {
                                                history?.isChoose && history.type == 'food'
                                                    ? <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>


                                                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                                                                <View
                                                                    style={{ flexGrow: 1, width: 'auto' }}
                                                                >
                                                                    <DateTimePickerModal
                                                                        date={new Date(history.time)}
                                                                        isVisible={isDatePickerVisible}
                                                                        mode="datetime"
                                                                        onConfirm={(val) => handleHistoryEdit(val, history)}
                                                                        onCancel={hideDatePicker}
                                                                        modalStyleIOS={{ color: '#C4E8FF' }}
                                                                    />

                                                                    <CustomButton
                                                                        title='Edit'
                                                                        buttonColor='blue'
                                                                        width={150}
                                                                        height={30}
                                                                        borderRadius={12}
                                                                        fontSize={14}
                                                                        onPress={() => showDatePicker()}
                                                                    />
                                                                </View>

                                                                <View
                                                                    style={{ flexGrow: 1, width: 'auto' }}
                                                                >
                                                                    <CustomButton
                                                                        title='Delete'
                                                                        buttonColor='red'
                                                                        width={150}
                                                                        height={30}
                                                                        borderRadius={12}
                                                                        fontSize={14}
                                                                        onPress={() => handleNoticeHistoryDelete(history)}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    : <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>


                                                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                                                                <View
                                                                    style={{ flexGrow: 1, width: 'auto' }}
                                                                >
                                                                    <CustomButton
                                                                        title='Delete'
                                                                        buttonColor='red'
                                                                        width={200}
                                                                        height={30}
                                                                        borderRadius={12}
                                                                        fontSize={14}
                                                                        onPress={() => handleNoticeHistoryDelete(history)}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                            }


                                        </View>
                                    </View>
                                </TouchableHighlight>
                            ))
                        }
                    </View>


                </ScrollView>
            </SafeAreaView >
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
        width: '100%',
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
        height: 70,
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#121212',
    },
})
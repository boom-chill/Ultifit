import axios from 'axios'
import React from 'react'
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



export default function HistoriesScreen() {
    const user = useSelector((state) => state.user.user)
    const histories = useSelector((state) => state.user.user.histories)

    const dispatch = useDispatch()

    const [chooseMode, setChooseMode] = React.useState(false)

    const [timeDelete, setTimeDelete] = React.useState('')

    const [foodEdit, setFoodEdit] = React.useState({
        ingredients: []
    })

    const handleChooseMode = () => {
        setChooseMode(!chooseMode)
    }

    const handleItemChooseChange = (idx) => {
        let newFoods = [...histories.eaten]

        newFoods[idx] = {
            ...newFoods[idx],
            isChoose: !newFoods[idx]?.isChoose ?? true
        }

        dispatch(updateFoodsHistories(newFoods))
    }

    const handleFoodDelete = () => {
        try {
            axios.delete(`${baseUrl}/api/histories/${timeDelete}`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        console.log("🚀 ~ file: HistoriesScreen.jsx ~ line 58 ~ .then ~ resData", resData)


                        setChooseMode(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleNoticeFoodDelete = (food) => {
        setTimeDelete(food.time)
        setChooseMode(true)
    }



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
                                    onPress={() => handleFoodDelete()}
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
                            histories.eaten.map((food, idx) => (
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
                                            style={{ ...styles.itemContainer, ...(food.isChoose ? { height: 140 } : { height: 90 }) }}
                                        >
                                            <View
                                                style={{ ...styles.itemFrontContainer }}
                                            >
                                                <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#C4C4C4', marginRight: 8, ...styles.middleCol }}>
                                                    <Image
                                                        source={{ uri: `${baseWideUrl}/${food?.thumbnail ? food.thumbnail : 'file/foods/dinner-temp.png'}` }}
                                                        style={food?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                    />
                                                </View>

                                                <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                    <View>
                                                        <Text style={{ fontSize: 22, fontWeight: '600' }}>
                                                            {
                                                                food.name
                                                            }
                                                        </Text>
                                                    </View>

                                                    <View style={{ ...styles.middleRow }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ color: '#727272' }} >
                                                                Protein: {kFormatter(food.protein)}g
                                                            </Text>
                                                            <Text style={{ color: '#727272' }} >
                                                                carb: {kFormatter(food.carb)}g
                                                            </Text>
                                                        </View>

                                                        <View>
                                                            <Text style={{ color: '#727272' }} >
                                                                Fat: {kFormatter(food.fat)}g
                                                            </Text>
                                                            <Text style={{ color: '#727272' }} >
                                                                Calogies: {kFormatter(food.calories)}cal
                                                            </Text>
                                                        </View>
                                                    </View>


                                                </View>
                                                <View style={{ position: 'absolute', top: -9, right: -3 }} >
                                                    <Text style={{ fontSize: 12, color: '#727272' }}>
                                                        {
                                                            convertTZ(food.time, "Asia/Jakarta")
                                                        }
                                                    </Text>
                                                </View>


                                            </View>

                                            {
                                                food?.isChoose
                                                    ? <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>
                                                        <ScrollView
                                                            horizontal={true}
                                                            style={{ marginTop: 0 }}
                                                        >
                                                        </ScrollView>

                                                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                                                                <View
                                                                    style={{ flexGrow: 1, width: 'auto' }}
                                                                >

                                                                    <CustomButton
                                                                        title='Edit'
                                                                        buttonColor='blue'
                                                                        width={150}
                                                                        height={30}
                                                                        borderRadius={12}
                                                                        fontSize={14}
                                                                        onPress={() => console.log('edit')}
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
                                                                        onPress={() => handleNoticeFoodDelete(food)}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    : <View></View>
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
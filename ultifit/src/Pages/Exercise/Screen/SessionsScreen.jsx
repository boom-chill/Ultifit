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
import { addFoods } from '../../../features/food/food';
import { addHistories } from '../../../features/histories/histories';
import { addSessions, addStartSession, openStartSession } from '../../../features/session/session';
import { calCaloriesBurn } from './../../../utils/calCaloriesBurn';
import StartExerciseModal from './../Modal/StartExerciseModal';
import PopupModal from './../../../Components/PopupModal/PopupModal';

export default function SessionScreen() {
    const { handleSubmit, control, formState: { errors }, watch } = useForm();
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.user)
    const userFoods = useSelector((state) => state.session.sessions)

    const [chooseMode, setChooseMode] = React.useState(false)

    const [foodEdit, setFoodEdit] = React.useState({
        exercises: []
    });

    const [foodDelete, setFoodDelete] = React.useState('')

    const [modalVisible, setModalVisible] = React.useState(false);

    const [image, setImage] = React.useState({})

    const [foods, setFoods] = React.useState([])

    React.useEffect(() => {

        axios.get(`${baseUrl}/api/sessions`, {
            params: {
                username: user.username,
            }
        })
            .then((response) => {
                const error = response.data?.error
                if (!error) {
                    const resData = response.data.message

                    dispatch(addSessions(resData))

                    const foods = AddIsChoose(resData)
                    setFoods(foods)
                } else {

                }
            })
    }, [])

    React.useEffect(() => {
        const foods = AddIsChoose(userFoods)
        setFoods(foods)
    }, [userFoods])


    const AddIsChoose = (foods) => {
        let newFoods = []

        foods.forEach((food) => {
            const newFood = {
                ...food,
                isChoose: false,
            }

            newFoods.push(newFood)
        })

        return newFoods
    }

    const onSubmit = (data) => {

        let totalCal = 0
        const restTime = Number(foodEdit.restTime)
        const practiceTime = Number(foodEdit.practiceTime)

        foodEdit.exercises.forEach((exercise, idx) => {
            totalCal += practiceTime * (calCaloriesBurn(exercise.MET, user.weight) / 60)
        })

        let totalTime = (restTime + practiceTime) * foodEdit.exercises.length

        const dataSend = {
            data: {
                ...foodEdit,
                name: foodEdit.name,
                description: foodEdit.description,
                caloriesBurn: totalCal,
                practiceTime: practiceTime,
                restTime: restTime,
                totalTime: totalTime,
            },
            img: image.base64 ?? null,
        }

        try {
            axios.patch(`${baseUrl}/api/sessions/${foodEdit._id}`,
                dataSend, {
                params: {
                    username: user.username,
                }
            }
            )
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message

                        dispatch(addSessions(resData))
                        setModalVisible(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }

    }

    React.useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const editFood = (food) => {
        setFoodEdit(food)
        setModalVisible(true)
    }

    const handleChooseMode = () => {
        setChooseMode(!chooseMode)
    }

    const cancelUpdate = () => {
        setImage({
            ...image,
            base64: null
        })
        setFoodEdit({
            exercises: []
        })
        setModalVisible(false)
    }

    const handleRestTimeChange = (restTime) => {
        setFoodEdit({
            ...foodEdit,
            restTime: restTime,
        })
    }

    const handlePracticeTimeChange = (practiceTime) => {
        setFoodEdit({
            ...foodEdit,
            practiceTime: practiceTime,
        })
    }

    const handleNameChange = (name) => {
        setFoodEdit({
            ...foodEdit,
            name: name,
        })
    }

    const handleDescriptChange = (des) => {
        setFoodEdit({
            ...foodEdit,
            description: des,
        })
    }

    const handleItemChooseChange = (idx) => {
        let newFoods = [...foods]

        newFoods[idx] = {
            ...newFoods[idx],
            isChoose: !newFoods[idx].isChoose
        }
        setFoods(newFoods)
    }

    const handleFoodDelete = () => {
        try {
            axios.delete(`${baseUrl}/api/sessions/${foodDelete}`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        dispatch(addSessions(resData))
                        setChooseMode(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleStartSession = (exercise) => {

        // const dataSend = {
        //     _sessionID: exercise._id,
        //     time: Date.now(),
        //     type: 'session',
        //     author: user.username,
        //     calories: exercise.caloriesBurn,
        //     totalTime: exercise.totalTime,
        //     name: exercise.name
        // }

        // try {
        //     axios.post(`${baseUrl}/api/histories`, dataSend, {
        //         params: {
        //             username: user.username,
        //         }
        //     })
        //         .then((response) => {
        //             const error = response.data?.error
        //             if (!error) {
        //                 const resData = response.data.message
        //                 dispatch(addHistories(resData))
        //             } else {

        //             }
        //         })
        // } catch (error) {
        //     console.log(error)
        // }

        console.log(exercise)
        dispatch(addStartSession(exercise))
        dispatch(openStartSession())
    }

    const handleNoticeFoodDelete = (id) => {
        setFoodDelete(id)
        setChooseMode(true)
    }

    return (
        <View style={{ width: '100%' }}>


            <View>

                <StartExerciseModal />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false)
                        cancelUpdate()
                    }}
                    statusBarTranslucent={true}
                >
                    <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', paddingTop: 30 }} >

                        <ScrollView  >
                            <View style={styles.headerWrapper}>
                                <Text style={styles.headerText}>
                                    Edit Food
                                </Text>
                            </View>



                            <View style={{ paddingLeft: 32, paddingRight: 32 }}>

                                <View style={{ ...styles.middleCol, width: '100%' }}>
                                    <View style={{ textAlign: 'start' }}>
                                        <Text style={{ marginBottom: 5, fontSize: 16, color: '#6E6E6E' }}>
                                            Image
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ ...styles.middleCol, backgroundColor: 'white', width: '100%' }}
                                        onPress={() => pickImage()}
                                    >
                                        <>
                                            <View style={{ backgroundColor: '#C4E8FF', height: 200, width: '100%', ...styles.middleCol, borderRadius: 10, borderStyle: 'dashed', borderWidth: 2 }}

                                            >
                                                {
                                                    foodEdit.thumbnail || image?.base64
                                                        ? (image?.base64
                                                            ? <Image source={{ uri: image.uri }} style={{ width: '100%', height: 196, borderRadius: 10 }}
                                                                resizeMode={'cover'} />
                                                            : <Image source={{ uri: `${baseWideUrl}/${foodEdit?.thumbnail}` }} style={{ width: '100%', height: 196, borderRadius: 10 }}
                                                                resizeMode={'cover'} />)
                                                        : <Image source={require('../../../../assets/Plus.png')} />
                                                }
                                            </View>
                                        </>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='name' title='Meal name' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.name} onChangeText={(name) => handleNameChange(name)} />
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10, ...styles.middleRow, justifyContent: 'space-between', width: '100%' }} >
                                    <View style={{ width: '48%' }}>
                                        <Input name='practiceTime' title='Practice time' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.practiceTime} placeholder={'second'} keyboardType={'numeric'} onChangeText={(practiceTime) => handlePracticeTimeChange(practiceTime)} />
                                    </View>

                                    <View style={{ width: '48%' }}>
                                        <Input name='restTime' title='Rest time' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.restTime} placeholder={'second'} keyboardType={'numeric'} onChangeText={(restTime) => handleRestTimeChange(restTime)} />
                                    </View>

                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='descript' title='Description' control={control} errors={errors} numberOfLines={5} inputStyle={{ height: 'auto' }} defaultValue={foodEdit.description} onChangeText={(des) => handleDescriptChange(des)} />
                                </View>
                            </View>


                            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
                                <ScrollView  >
                                    <View style={{ ...styles.container }}>

                                        {
                                            foodEdit?.exercises.map((food, idx) => (

                                                <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }} key={idx} >
                                                    <View
                                                        style={{ ...styles.itemContainer, ...(food.isOpen ? { height: 310 } : { height: 90 }) }}
                                                    >
                                                        <TouchableHighlight
                                                            style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                                            underlayColor='white'
                                                        >
                                                            <View
                                                                style={{ ...styles.itemFrontContainer }}
                                                            >
                                                                <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFF6EF', marginRight: 8, ...styles.middleCol }}>
                                                                    <Image
                                                                        source={{ uri: `${baseWideUrl}/${food?.thumbnail ? food.thumbnail : 'file/exercises/exercise-temp.png'}` }}
                                                                        style={food?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                                    />
                                                                </View>

                                                                <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                                    <View>
                                                                        <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 210 }} numberOfLines={1} ellipsizeMode='tail'>
                                                                            {
                                                                                food.name
                                                                            }
                                                                        </Text>
                                                                    </View>

                                                                    <View style={{ ...styles.middleRow, }}>
                                                                        <View style={{ width: 200, position: 'relative', bottom: 6 }}>
                                                                            <Text style={{ color: '#727272', fontSize: 15 }} >
                                                                                <Image source={
                                                                                    require('../../../../assets/icon-ex-fire.png')
                                                                                }
                                                                                    style={{ width: 15, height: 15 }}
                                                                                />
                                                                                {calCaloriesBurn(food.MET, user.weight)}cal/min
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableHighlight>

                                                    </View>
                                                </View>



                                            ))
                                        }
                                    </View>

                                    <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 16 }}>
                                        <CustomButton
                                            title='Edit'
                                            buttonColor='blue'
                                            width={'45%'}
                                            height={40}
                                            borderRadius={12}
                                            fontSize={14}
                                            type={'submit'}
                                            onPress={handleSubmit(onSubmit)}
                                        />

                                        <CustomButton
                                            title='Cancel'
                                            buttonColor='red'
                                            width={'45%'}
                                            height={40}
                                            borderRadius={12}
                                            fontSize={14}
                                            onPress={() => cancelUpdate()}
                                        />
                                    </View>

                                </ScrollView>
                            </SafeAreaView >
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </View >

            <View style={{ ...styles.chooseButtonContainer }}>
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
                            foods.map((food, idx) => (
                                <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }} key={idx} >
                                    <View
                                        style={{ ...styles.itemContainer, ...(food.isChoose ? { height: 180 } : { height: 90 }) }}
                                    >
                                        <TouchableHighlight

                                            onPress={() => {
                                                handleItemChooseChange(idx)
                                                setChooseMode(false)
                                            }}
                                            style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                            underlayColor='white'
                                        >
                                            <View
                                                style={{ ...styles.itemFrontContainer }}
                                            >
                                                <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFEBEA', marginRight: 8, ...styles.middleCol }}>
                                                    <Image
                                                        source={{ uri: `${baseWideUrl}/${food?.thumbnail ? food.thumbnail : 'file/exercises/session-temp.png'}` }}
                                                        style={food?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                    />
                                                </View>

                                                <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                    <View>
                                                        <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 210 }} numberOfLines={1} ellipsizeMode='tail'>
                                                            {
                                                                food.name
                                                            }
                                                        </Text>
                                                    </View>

                                                    <View style={{ ...styles.middleRow, }}>
                                                        <View style={{ width: 60, }}>
                                                            <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                <Image source={
                                                                    require('../../../../assets/icon-ex-alarm.png')
                                                                }
                                                                    style={{ width: 15, height: 15 }}
                                                                />
                                                                {food.restTime}s
                                                            </Text>

                                                            <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                <Image source={
                                                                    require('../../../../assets/icon-ex-timer.png')
                                                                }
                                                                    style={{ width: 15, height: 15 }}
                                                                />
                                                                {food.practiceTime}s
                                                            </Text>
                                                        </View>

                                                        <View style={{ width: 80, }}>
                                                            <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                <Image source={
                                                                    require('../../../../assets/icon-ex-heartbeat.png')
                                                                }
                                                                    style={{ width: 15, height: 15 }}
                                                                />
                                                                {food.exercises.length} exs
                                                            </Text>

                                                            <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                <Image source={
                                                                    require('../../../../assets/icon-ex-fire.png')
                                                                }
                                                                    style={{ width: 15, height: 15 }}
                                                                />
                                                                {parseFloat(food.caloriesBurn).toFixed(0)} cal
                                                            </Text>
                                                        </View>

                                                        <View style={{ width: 80, }}>

                                                            <Text style={{ color: '#727272', fontSize: 14 }} >

                                                            </Text>

                                                            <Text style={{ color: '#727272', fontSize: 14 }} >
                                                                <Image source={
                                                                    require('../../../../assets/icon-ex-clock.png')
                                                                }
                                                                    style={{ width: 15, height: 15 }}
                                                                />
                                                                {food.totalTime > 60 ? parseFloat(food.totalTime / 60).toFixed(0) + 'min' : parseFloat(food.totalTime).toFixed(0) + 's'}
                                                            </Text>

                                                        </View>

                                                    </View>




                                                </View>
                                                <View style={{ position: 'absolute', top: 25, right: 10, maxWidth: 50 }} >
                                                    <AntDesign name={food.isChoose ? "down" : 'right'} size={24} color='#C4C4C4' />
                                                </View>

                                            </View>
                                        </TouchableHighlight>

                                        {
                                            food.isChoose
                                                ? <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>
                                                    <ScrollView
                                                        horizontal={true}
                                                        style={{ marginTop: 10 }}
                                                    >
                                                        <View style={{ ...styles.middleRow, zIndex: 100 }}>
                                                            {
                                                                food.exercises.map((ingredient, idx) => (
                                                                    <View style={{ ...styles.middleRow, width: 'auto', heigh: 30, backgroundColor: '#E9E9E9', borderRadius: 12, marginRight: 8 }}
                                                                        key={idx}
                                                                    >
                                                                        <Text style={{ paddingRight: 10, paddingLeft: 10, paddingBottom: 4, paddingTop: 4, }}>
                                                                            {
                                                                                ingredient.name
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                ))
                                                            }
                                                        </View>
                                                    </ScrollView>

                                                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                                            <View
                                                                style={{ flexGrow: 1, width: 'auto' }}
                                                            >

                                                                <CustomButton
                                                                    title='Start'
                                                                    buttonColor='purple'
                                                                    width={90}
                                                                    height={30}
                                                                    borderRadius={12}
                                                                    fontSize={14}
                                                                    onPress={() => handleStartSession(food)}
                                                                />
                                                            </View>

                                                            <View
                                                                style={{ flexGrow: 1, width: 'auto' }}
                                                            >

                                                                <CustomButton
                                                                    title='Edit'
                                                                    buttonColor='blue'
                                                                    width={90}
                                                                    height={30}
                                                                    borderRadius={12}
                                                                    fontSize={14}
                                                                    onPress={() => editFood(food)}
                                                                />
                                                            </View>

                                                            <View
                                                                style={{ flexGrow: 1, width: 'auto' }}
                                                            >
                                                                <CustomButton
                                                                    title='Delete'
                                                                    buttonColor='red'
                                                                    width={90}
                                                                    height={30}
                                                                    borderRadius={12}
                                                                    fontSize={14}
                                                                    onPress={() => handleNoticeFoodDelete(food._id)}
                                                                />
                                                            </View>

                                                            {/* <View
                                                                    style={{ flexGrow: 1, width: 'auto' }}
                                                                >

                                                                    <CustomButton
                                                                        title='i'
                                                                        buttonColor='gray'
                                                                        width={30}
                                                                        height={30}
                                                                        borderRadius={30}
                                                                        fontSize={14}
                                                                        onPress={() => setModalVisible(true)}
                                                                    />
                                                                </View> */}
                                                        </View>
                                                    </View>
                                                </View>
                                                : <View></View>
                                        }


                                    </View>
                                </View>

                            ))
                        }
                    </View>


                </ScrollView>
            </SafeAreaView >


        </View >
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
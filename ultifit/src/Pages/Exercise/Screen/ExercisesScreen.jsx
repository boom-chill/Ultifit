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
import { Video, AVPlaybackStatus } from 'expo-av';
import Checkbox from 'expo-checkbox';
import { calCaloriesBurn } from './../../../utils/calCaloriesBurn';
import { addSessions } from '../../../features/session/session';


export default function ExercisesScreen({ navigation }) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { handleSubmit, control, formState: { errors }, watch } = useForm();
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.user)

    const [chooseMode, setChooseMode] = React.useState(false)

    const [foodEdit, setFoodEdit] = React.useState({
        ingredients: []
    });

    const [foodDelete, setFoodDelete] = React.useState('')

    const [modalVisible, setModalVisible] = React.useState(false);


    const [image, setImage] = React.useState({})

    const [foods, setFoods] = React.useState([])

    React.useEffect(() => {

        axios.get(`${baseUrl}/api/exercises`, {
            params: {
                username: user.username,
            }
        })
            .then((response) => {
                const error = response.data?.error
                if (!error) {
                    const resData = response.data.message

                    const foods = AddIsChoose(resData)
                    setFoods(foods)
                } else {

                }
            })
    }, [user])

    const AddIsChoose = (foods) => {
        let newFoods = []

        foods.forEach((food) => {
            const newFood = {
                ...food,
                isChoose: false,
                isOpen: false,
            }

            newFoods.push(newFood)
        })

        return newFoods
    }

    const onSubmit = (data) => {

        let totalCal = 0
        const restTime = Number(data.restTime)
        const practiceTime = Number(data.practiceTime)

        let sendExercises = []
        foods.forEach((exercise, idx) => {
            if (exercise.isChoose) {
                const newIngredient = {
                    _id: exercise._id,
                }
                sendExercises.push(newIngredient)

                totalCal += practiceTime * (calCaloriesBurn(exercise.MET, user.weight) / 60)
            }
        })

        let totalTime = (restTime + practiceTime) * sendExercises.length

        const dataSend = {
            data: {
                name: data.name,
                description: data.description,
                exercises: sendExercises,
                caloriesBurn: totalCal,
                practiceTime: practiceTime,
                restTime: restTime,
                totalTime: totalTime,
                author: user.username
            },
            img: image.base64 ?? null,
        }

        try {
            axios.post(`${baseUrl}/api/sessions`,
                dataSend, {
                params: {
                    username: user.username,
                }
            })
                .then((response) => {
                    const resData = response.data.message

                    dispatch(addSessions(resData))
                    setChooseMode(false)
                    setModalVisible(false)
                    navigation.navigate('SessionsScreen')

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
            ingredients: []
        })
        setModalVisible(false)
    }

    const handleMassChange = (ingredient, mass) => {
        let newIngredient = {
            ...ingredient,
            mass: mass,
        }
        let newIngredients = [
            ...foodEdit.ingredients,
        ]
        const objIndex = foodEdit.ingredients.findIndex((obj => obj._id == ingredient._id))
        newIngredients[objIndex] = {
            ...newIngredient
        }

        setFoodEdit({
            ...foodEdit,
            ingredients: newIngredients
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

    const handleItemOpenChange = (idx) => {
        let newFoods = [...foods]

        newFoods[idx] = {
            ...newFoods[idx],
            isOpen: !newFoods[idx].isOpen
        }

        setFoods(newFoods)
    }

    const handleFoodDelete = () => {
        try {
            axios.delete(`${baseUrl}/api/foods/${foodDelete}`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message

                        dispatch(addFoods(resData))
                        setChooseMode(false)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFood = (food) => {

        const dataSend = {
            _foodID: food._id,
            time: Date.now(),
            type: 'food',
            author: user.username,
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





    const renderItem = ({ item, drag, isActive }) => (
        <TouchableHighlight
            onPress={drag}

            style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
            underlayColor='white'
        >
            <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                <View
                    style={{ ...styles.itemContainer, flexDirection: 'row' }}
                >
                    <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFF3E9', marginRight: 8, ...styles.middleCol }}>
                        <Image
                            source={{ uri: `${baseWideUrl}/${item?.thumbnail ? item.thumbnail : 'file/exercises/exercise-temp.png'}` }}
                            style={item?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                        />
                    </View>

                    <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                        <View>
                            <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 210 }} numberOfLines={1} ellipsizeMode='tail'>
                                {
                                    item.name
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
                                    {calCaloriesBurnMin(item.MET, user.weight)}cal/min
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        </TouchableHighlight>
    );


    return (
        <View style={{ width: '100%' }}>

            <View>
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
                                    Create Session
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
                                    <Input name='name' title='Session name' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.name} defaultValue={watch('name')} />
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10, ...styles.middleRow, justifyContent: 'space-between', width: '100%' }} >
                                    <View style={{ width: '48%' }}>

                                        <Input name='practiceTime' title='Practice time' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.name} placeholder={'second'} defaultValue={watch('practiceTime')} keyboardType={'numeric'} />
                                    </View>

                                    <View style={{ width: '48%' }}>

                                        <Input name='restTime' title='Rest time' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={foodEdit.name} placeholder={'second'} defaultValue={watch('restTime')} keyboardType={'numeric'} />
                                    </View>

                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='description' title='Description' control={control} errors={errors} numberOfLines={5} inputStyle={{ height: 'auto' }} defaultValue={foodEdit.description} defaultValue={watch('description')} />
                                </View>

                            </View>


                            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
                                <ScrollView  >
                                    <View style={{ ...styles.container }}>

                                        {
                                            foods.map((exercise, idx) => (
                                                exercise.isChoose ?

                                                    <TouchableHighlight
                                                        key={idx}
                                                        onLongPress={() => handleChooseMode()}

                                                        style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                                        underlayColor='white'
                                                    >
                                                        <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                                                            <View
                                                                style={{ ...styles.itemContainer, flexDirection: 'row' }}
                                                            >
                                                                <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFF3E9', marginRight: 8, ...styles.middleCol }}>
                                                                    <Image
                                                                        source={{ uri: `${baseWideUrl}/${exercise?.thumbnail ? exercise.thumbnail : 'file/exercises/exercise-temp.png'}` }}
                                                                        style={exercise?.thumbnail ? { width: '100%', height: '100%', borderRadius: 10 } : { width: 60, height: 60 }}
                                                                    />
                                                                </View>

                                                                <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                                    <View>
                                                                        <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 210 }} numberOfLines={1} ellipsizeMode='tail'>
                                                                            {
                                                                                exercise.name
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
                                                                                {calCaloriesBurn(exercise.MET, user.weight)}cal/min
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>

                                                                {/* <View style={{ position: 'absolute', top: 0, right: 14, maxWidth: 50 }} >
                                                                    <Input name={exercise._id} control={control} errors={errors} rules={{ required: 'enter' }}
                                                                        onChangeText={(mass) => handleMassChange(exercise, mass)}
                                                                        placeholder='gram' defaultValue={exercise.mass} keyboardType={'number-pad'} />
                                                                </View> */}
                                                            </View>
                                                        </View>
                                                    </TouchableHighlight>
                                                    : <View key={idx} ></View>

                                            ))
                                        }


                                    </View>

                                    <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 16 }}>
                                        <CustomButton
                                            title='Create'
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
                                    title='Create Session'
                                    buttonColor='purple'
                                    width={'45%'}
                                    height={40}
                                    borderRadius={12}
                                    fontSize={14}
                                    onPress={() => setModalVisible(true)}
                                />

                                <CustomButton
                                    title='Cancel'
                                    buttonColor='red'
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
                                        style={{ ...styles.itemContainer, ...(food.isOpen ? { height: 310 } : { height: 90 }) }}
                                    >
                                        <TouchableHighlight
                                            onLongPress={() => handleChooseMode()}
                                            onPress={() => {
                                                handleItemOpenChange(idx)
                                            }}
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

                                                <View style={{ position: 'absolute', top: 25, right: 10, maxWidth: 50, ...(!chooseMode ? { right: 10 } : { right: 5 }) }} >
                                                    {
                                                        chooseMode
                                                            ? <Checkbox
                                                                style={{ height: 24, width: 24, borderRadius: 5 }}
                                                                value={food.isChoose}
                                                                onValueChange={() => handleItemChooseChange(idx)}
                                                                color={food.isChoose ? '#45D04C' : '#C4C4C4'} />
                                                            :
                                                            <AntDesign name={food.isOpen ? "down" : 'right'} size={24} color='#C4C4C4' />
                                                    }
                                                </View>



                                            </View>
                                        </TouchableHighlight>



                                        {
                                            food.isOpen
                                                ? <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>

                                                    <View style={{ ...styles.middleRow, zIndex: 100, height: 210 }}>
                                                        <View style={styles.container}>
                                                            <Video
                                                                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                                                source={{
                                                                    uri: `${baseUrl}/${food.video}`,
                                                                }}
                                                                ratio={16 / 9}
                                                                resizeMode="cover"
                                                                isLooping
                                                                isMuted={true}
                                                                shouldPlay
                                                            />
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
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

export default function FoodsScreen() {
    const { handleSubmit, control, formState: { errors }, watch } = useForm();
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.user)
    const userFoods = useSelector((state) => state.food.foods)

    const [chooseMode, setChooseMode] = React.useState(false)

    const [foodEdit, setFoodEdit] = React.useState({
        ingredients: []
    });

    const [foodDelete, setFoodDelete] = React.useState('')

    const [modalVisible, setModalVisible] = React.useState(false);


    const [image, setImage] = React.useState({})

    const [foods, setFoods] = React.useState([])

    React.useEffect(() => {

        axios.get(`${baseUrl}/api/foods`, {
            params: {
                username: user.username,
            }
        })
            .then((response) => {
                const error = response.data?.error
                if (!error) {
                    const resData = response.data.message

                    dispatch(addFoods(resData))

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

        let newFat = 0
        let newCalo = 0
        let newPro = 0
        let newCarb = 0

        foodEdit.ingredients.forEach((ingredient, idx) => {
            newFat += ingredient.fat * ingredient.mass
            newCalo += ingredient.calories * ingredient.mass
            newPro += ingredient.protein * ingredient.mass
            newCarb += ingredient.carb * ingredient.mass

        })

        let newFoodEdit = {
            ...foodEdit,
            fat: newFat,
            calories: newCalo,
            protein: newPro,
            carb: newCarb,
        }

        const dataSend = {
            data: newFoodEdit,
            img: image.base64 ?? null,
        }

        try {
            axios.patch(`${baseUrl}/api/foods`,
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

                        dispatch(addFoods(resData))
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
            calories: food.calories,
            protein: food.protein,
            carb: food.carb,
            fat: food.fat,
            name: food.name
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

    const handleNoticeFoodDelete = (id) => {
        setFoodDelete(id)
        setChooseMode(true)
    }


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

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='descript' title='Description' control={control} errors={errors} numberOfLines={5} inputStyle={{ height: 'auto' }} defaultValue={foodEdit.description} onChangeText={(des) => handleDescriptChange(des)} />
                                </View>
                            </View>


                            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
                                <ScrollView  >
                                    <View style={{ ...styles.container }}>

                                        {
                                            foodEdit.ingredients.map((ingredient, idx) => (


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
                                                            <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFEEDF', marginRight: 8, ...styles.middleCol }}>
                                                                <Image
                                                                    source={{ uri: `${baseWideUrl}/${ingredient?.thumbnail ? ingredient.thumbnail : 'file/ingredients/ingredients.png'}` }}
                                                                    style={{ width: 50, height: 50 }}
                                                                />
                                                            </View>

                                                            <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                                <View>
                                                                    <Text style={{ fontSize: 22, fontWeight: '600' }}>
                                                                        {
                                                                            ingredient.name
                                                                        }
                                                                    </Text>
                                                                </View>

                                                                <View style={{ ...styles.middleRow }}>
                                                                    <View style={{ width: 100, }}>
                                                                        <Text style={{ color: '#727272' }} >
                                                                            Protein: {ingredient.protein}
                                                                        </Text>
                                                                        <Text style={{ color: '#727272' }} >
                                                                            carb: {ingredient.carb}
                                                                        </Text>
                                                                    </View>

                                                                    <View>
                                                                        <Text style={{ color: '#727272' }} >
                                                                            Fat: {ingredient.fat}
                                                                        </Text>
                                                                        <Text style={{ color: '#727272' }} >
                                                                            Calogies: {ingredient.calories}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View style={{ position: 'absolute', top: 0, right: 14, maxWidth: 50 }} >
                                                                <Input name={ingredient._id} control={control} errors={errors} rules={{ required: 'enter' }}
                                                                    onChangeText={(mass) => handleMassChange(ingredient, mass)}
                                                                    placeholder='gram' defaultValue={ingredient.mass} keyboardType={'number-pad'} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableHighlight>


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
                                                <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#C4C4C4', marginRight: 8, ...styles.middleCol }}>
                                                    <Image
                                                        source={{ uri: `${baseWideUrl}/${food?.thumbnail ? food.thumbnail : 'file/foods/dinner-temp.png'}` }}
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
                                                                food.ingredients.map((ingredient, idx) => (
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
                                                                    title='Add'
                                                                    buttonColor='purple'
                                                                    width={90}
                                                                    height={30}
                                                                    borderRadius={12}
                                                                    fontSize={14}
                                                                    onPress={() => handleAddFood(food)}
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
import axios from 'axios'
import React from 'react'
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import { useSelector } from 'react-redux';
import CustomButton from './../../../Components/CustomButton/CustomButton';
import { Input } from '../../../Components/Input/Input';
import { useForm } from "react-hook-form";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

export default function FoodsScreen() {
    const { handleSubmit, control, formState: { errors }, watch } = useForm();

    const user = useSelector((state) => state.user.user)

    const [chooseMode, setChooseMode] = React.useState(false)

    const [foodEdit, setFoodEdit] = React.useState({
        ingredients: []
    });

    const [modalVisible, setModalVisible] = React.useState(false);

    const imgUrl = baseWideUrl + '/' + user.avatar
    const [image, setImage] = React.useState({
        uri: imgUrl
    })

    const [foods, setFoods] = React.useState([])

    React.useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/foods`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message

                        let newFoods = []
                        resData.forEach((food) => {
                            const newFood = {
                                ...food,
                                isChoose: false,
                            }

                            newFoods.push(newFood)
                        })

                        setFoods(resData)
                    } else {

                    }
                })
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onSubmit = (data) => {
        console.log('submit')
        console.log(ingredients)
        console.log(data)

        let newFat = 0
        let newCalo = 0
        let newPro = 0
        let newCarb = 0

        let sendIngredients = []
        ingredients.forEach((ingredient, idx) => {
            if (ingredient.isChoose) {
                const newIngredient = {
                    _ingerdientID: ingredient._id,
                    mass: watch(ingredient._id),
                }
                sendIngredients.push(newIngredient)

                newFat += ingredient.fat
                newCalo += ingredient.calories
                newPro += ingredient.protein
                newCarb += ingredient.carb
            }
        })

        const dataSend = {
            data: {
                name: data.name,
                ingredients: sendIngredients,
                carb: newCarb,
                protein: newPro,
                fat: newFat,
                calories: newCalo,
                author: user.username,
                description: data.descript
            },
            img: image.base64 ?? null,
        }


        console.log('data', dataSend)

        try {
            axios.post(`${baseUrl}/api/foods`,
                dataSend
            ).then((response) => {
                const resData = response.data
                console.log(resData)
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

    const handleItemChooseChange = (idx) => {
        let newFoods = [...foods]

        newFoods[idx] = {
            ...newFoods[idx],
            isChoose: !newFoods[idx].isChoose
        }
        setFoods(newFoods)
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
                                                    foodEdit.thumbnail
                                                        ? <Image source={{ uri: `${baseWideUrl}/${foodEdit?.thumbnail}` }} style={{ width: '100%', height: 196, borderRadius: 10 }}
                                                            resizeMode={'cover'} />
                                                        : <Image source={require('../../../../assets/Plus.png')} />
                                                }
                                            </View>
                                        </>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='name' title='Meal name' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={watch('name') || foodEdit.name} />
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='descript' title='Description' control={control} errors={errors} numberOfLines={5} inputStyle={{ height: 'auto' }} defaultValue={watch('descript') || foodEdit.description} />
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
                                                                <Input name={ingredient._id} control={control} errors={errors} rules={{ required: 'enter' }} placeholder='gram' defaultValue={watch(ingredient._id) || ingredient.mass} keyboardType={'number-pad'} />
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
                                            onPress={() => setModalVisible(false)}
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
                                    onPress={() => console.log('delete')}
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
                                <TouchableHighlight
                                    key={idx}
                                    onLongPress={() => handleChooseMode()}
                                    onPress={() => {
                                        handleItemChooseChange(idx)
                                        setChooseMode(false)
                                    }}
                                    style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                    underlayColor='white'
                                >
                                    <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                                        <View
                                            style={{ ...styles.itemContainer, ...(food.isChoose ? { height: 180 } : { height: 90 }) }}
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
                                                                Protein: {food.protein}g
                                                            </Text>
                                                            <Text style={{ color: '#727272' }} >
                                                                carb: {food.carb}g
                                                            </Text>
                                                        </View>

                                                        <View>
                                                            <Text style={{ color: '#727272' }} >
                                                                Fat: {food.fat}g
                                                            </Text>
                                                            <Text style={{ color: '#727272' }} >
                                                                Calogies: {food.calories}cal
                                                            </Text>
                                                        </View>
                                                    </View>


                                                </View>
                                                <View style={{ position: 'absolute', top: 25, right: 10, maxWidth: 50 }} >
                                                    <AntDesign name={food.isChoose ? "down" : 'right'} size={24} color='#C4C4C4' />
                                                </View>


                                            </View>

                                            {
                                                food.isChoose
                                                    ? <View style={{ borderTopWidth: 1, width: '100%', marginTop: 9, borderTopColor: '#C4C4C4' }}>
                                                        <ScrollView
                                                            horizontal={true}
                                                            style={{ marginTop: 10 }}
                                                        >
                                                            <View style={{ ...styles.middleRow }}>
                                                                {
                                                                    food.ingredients.map((ingredient) => (
                                                                        <View style={{ ...styles.middleRow, width: 'auto', heigh: 30, backgroundColor: '#E9E9E9', borderRadius: 12, marginRight: 8 }}>
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
                                                                        onPress={() => console.log('add')}
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
                                                                        onPress={() => handleChooseMode()}
                                                                    />
                                                                </View>

                                                                <View
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
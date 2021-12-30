import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import Checkbox from 'expo-checkbox';
import CustomButton from './../../../Components/CustomButton/CustomButton';
import { Input } from '../../../Components/Input/Input';
import { useForm } from "react-hook-form";
import { updateFoods } from '../../../features/user/user';
import { addFoods } from '../../../features/food/food';
import { formatNumber } from '../../../utils/kFormatter';


export default function IngredientsScreen({ navigation, route }) {
    const { handleSubmit, control, formState: { errors }, watch } = useForm();

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    const [ingredients, setIngredients] = React.useState([])
    const [chooseMode, setChooseMode] = React.useState(false)

    const [modalVisible, setModalVisible] = React.useState(false);

    const imgUrl = baseWideUrl + '/' + user.avatar
    const [image, setImage] = React.useState({
        uri: imgUrl
    })

    React.useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/ingredients`)
                .then((response) => {
                    const resData = response.data


                    let newIngredients = []
                    resData.message.forEach((ingredient) => {
                        const newIngredient = {
                            ...ingredient,
                            isChoose: false,
                        }

                        newIngredients.push(newIngredient)
                    })
                    setIngredients(newIngredients)
                })
        } catch (error) {
            console.log(error)
        }

    }, [])

    const onSubmit = (data) => {

        let newFat = 0
        let newCalo = 0
        let newPro = 0
        let newCarb = 0

        let sendIngredients = []
        ingredients.forEach((ingredient, idx) => {
            if (ingredient.isChoose) {
                const newIngredient = {
                    _id: ingredient._id,
                    mass: watch(ingredient._id),
                }
                sendIngredients.push(newIngredient)

                newFat += ingredient.fat * watch(ingredient._id)
                newCalo += ingredient.calories * watch(ingredient._id)
                newPro += ingredient.protein * watch(ingredient._id)
                newCarb += ingredient.carb * watch(ingredient._id)
            }
        })

        const dataSend = {
            data: {
                username: user.username,
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

        try {
            axios.post(`${baseUrl}/api/foods`,
                dataSend, {
                params: {
                    username: user.username,
                }
            })
                .then((response) => {
                    const resData = response.data.message

                    dispatch(addFoods(resData))
                    setChooseMode(false)
                    setModalVisible(false)
                    navigation.navigate('FoodsScreen')

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

    const handleChooseMode = () => {
        setChooseMode(!chooseMode)
    }

    const handleItemChooseChange = (idx) => {
        let newIngredients = [...ingredients]

        newIngredients[idx] = {
            ...newIngredients[idx],
            isChoose: !newIngredients[idx].isChoose
        }
        setIngredients(newIngredients)
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
                                    Create Food
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
                                                    image?.base64
                                                        ? <Image source={{ uri: image.uri }} style={{ width: '100%', height: 196, borderRadius: 10 }}
                                                            resizeMode={'cover'} />
                                                        : <Image source={require('../../../../assets/Plus.png')} />
                                                }
                                            </View>
                                        </>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='name' title='Meal name' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={watch('name')} />
                                </View>

                                <View style={{ ...styles.loginInputWrapper, marginTop: 10 }} >
                                    <Input name='descript' title='Description' control={control} errors={errors} numberOfLines={5} inputStyle={{ height: 'auto' }} defaultValue={watch('descript')} />
                                </View>
                            </View>


                            <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
                                <ScrollView  >
                                    <View style={{ ...styles.container }}>

                                        {
                                            ingredients.map((ingredient, idx) => (
                                                ingredient.isChoose ?

                                                    <TouchableHighlight
                                                        key={idx}
                                                        onLongPress={() => handleChooseMode()}
                                                        style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                                        underlayColor='white'
                                                    >
                                                        <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                                                            <View

                                                                style={{ ...styles.itemContainer }}
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
                                                                                Protein: {formatNumber(ingredient.protein, 2)}/g
                                                                            </Text>
                                                                            <Text style={{ color: '#727272' }} >
                                                                                carb: {formatNumber(ingredient.carb, 2)}/g
                                                                            </Text>
                                                                        </View>

                                                                        <View>
                                                                            <Text style={{ color: '#727272' }} >
                                                                                Fat: {formatNumber(ingredient.fat, 2)}/g
                                                                            </Text>
                                                                            <Text style={{ color: '#727272' }} >
                                                                                Calogies: {formatNumber(ingredient.calories, 2)}/g
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>

                                                                <View style={{ position: 'absolute', top: 0, right: 14, maxWidth: 50 }} >
                                                                    <Input name={ingredient._id} control={control} errors={errors} rules={{ required: 'enter' }} placeholder='gram' defaultValue={watch(ingredient._id)} keyboardType={'number-pad'} />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableHighlight>

                                                    : <View key={idx} ></View>
                                            ))
                                        }
                                    </View>

                                    <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 16 }}>
                                        <CustomButton
                                            title='Complete'
                                            buttonColor='purple'
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
                                    title='Create Food'
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
                <ScrollView >
                    <View style={{ ...styles.container }}>

                        {
                            ingredients.map((ingredient, idx) => (
                                <TouchableHighlight
                                    key={idx}
                                    onLongPress={() => handleChooseMode()}
                                    style={{ width: '100%', ...styles.middleCol, backgroundColor: 'white' }}
                                    underlayColor='white'
                                >
                                    <View style={{ width: '100%', ...styles.middleRow, backgroundColor: 'white' }}>

                                        <View

                                            style={{ ...styles.itemContainer }}
                                        >
                                            <View style={{ width: 90, height: 73, borderRadius: 10, backgroundColor: '#FFEEDF', marginRight: 8, ...styles.middleCol }}>
                                                <Image
                                                    source={{ uri: `${baseWideUrl}/${ingredient?.thumbnail ? ingredient.thumbnail : 'file/ingredients/ingredients.png'}` }}
                                                    style={{ width: 50, height: 50 }}
                                                />
                                            </View>

                                            <View style={{ ...styles.middleCol, alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
                                                <View>
                                                    <Text style={{ fontSize: 22, fontWeight: '600', maxWidth: 210 }} numberOfLines={1} ellipsizeMode='tail'>
                                                        {
                                                            ingredient.name
                                                        }
                                                    </Text>
                                                </View>

                                                <View style={{ ...styles.middleRow }}>
                                                    <View style={{ width: 100, }}>
                                                        <Text style={{ color: '#727272' }} >
                                                            Protein: {formatNumber(ingredient.protein, 2)}/g
                                                        </Text>
                                                        <Text style={{ color: '#727272' }} >
                                                            carb: {formatNumber(ingredient.carb, 2)}/g
                                                        </Text>
                                                    </View>

                                                    <View>
                                                        <Text style={{ color: '#727272' }} >
                                                            Fat: {formatNumber(ingredient.fat, 2)}/g
                                                        </Text>
                                                        <Text style={{ color: '#727272' }} >
                                                            Calogies: {formatNumber(ingredient.calories, 2)}/g
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={chooseMode ? { position: 'absolute', top: 33, right: 14, opacity: 100 } : { opacity: 0 }}>
                                                <Checkbox
                                                    style={{ height: 24, width: 24, borderRadius: 5 }}
                                                    value={ingredient.isChoose}
                                                    onValueChange={() => handleItemChooseChange(idx)}
                                                    color={ingredient.isChoose ? '#45D04C' : '#C4C4C4'}
                                                />
                                            </View>


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
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 90,
        borderColor: '#C4C4C4',
        borderWidth: 1,
        width: '96%',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
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
        paddingBottom: 10,

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

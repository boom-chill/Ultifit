import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import Checkbox from 'expo-checkbox';
import CustomButton from './../../../Components/CustomButton/CustomButton';

export default function IngredientsScreen() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    const [ingredients, setIngredients] = React.useState([])
    const [chooseMode, setChooseMode] = React.useState(false)

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
        if (user?.username) {
            const dataSend = {
                data: { ...data },
                newAvatar: (image?.base64 ?? null)
            }
            console.log('data', dataSend)

            try {
                axios.patch(`${baseUrl}/api/users/${user.username}`,
                    dataSend
                ).then((response) => {
                    const resData = response.data
                    console.log(resData)
                    dispatch(addUser(resData.message))
                })
            } catch (error) {
                console.log(error)
            }
        } else {

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
            aspect: [4, 4],
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
        console.log('enter')
        let newIngredients = [...ingredients]

        newIngredients[idx] = {
            ...newIngredients[idx],
            isChoose: !newIngredients[idx].isChoose
        }
        setIngredients(newIngredients)
    }


    return (
        <View style={{ width: '100%' }}>
            <View style={{ ...styles.chooseButtonContainer }}>
                {
                    chooseMode
                        ? <View style={{ ...styles.chooseButtonWrapper }}>
                            <View style={{ ...styles.middleRow, justifyContent: 'space-around', width: '100%' }}>
                                <CustomButton
                                    title='Create Meal'
                                    buttonColor='purple'
                                    width={'45%'}
                                    height={40}
                                    borderRadius={12}
                                    fontSize={14}
                                    onPress={() => console.log('create')}
                                />

                                <CustomButton
                                    title='Cancel'
                                    buttonColor='red'
                                    width={'45%'}
                                    height={40}
                                    borderRadius={12}
                                    fontSize={14}
                                    onPress={() => console.log('cancel')}
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
                                                    <Text style={{ fontSize: 22, fontWeight: '600' }}>
                                                        {
                                                            ingredient.name
                                                        }
                                                    </Text>
                                                </View>

                                                <View style={{ ...styles.middleRow }}>
                                                    <View style={{ width: 100, }}>
                                                        <Text style={{ color: '#727272' }} >
                                                            Protein: {ingredient.protein}/g
                                                        </Text>
                                                        <Text style={{ color: '#727272' }} >
                                                            carb: {ingredient.carb}/g
                                                        </Text>
                                                    </View>

                                                    <View>
                                                        <Text style={{ color: '#727272' }} >
                                                            Fat: {ingredient.fat}/g
                                                        </Text>
                                                        <Text style={{ color: '#727272' }} >
                                                            Calogies: {ingredient.calories}/g
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
})

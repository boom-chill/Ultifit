import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { baseUrl } from '../../../constants/url'
import axios from 'axios';
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage';

import { useSelector, useDispatch } from 'react-redux'
import { addUser, deleteUser } from '../../features/user/user'
import CustomButton from './../../Components/CustomButton/CustomButton';
import { useForm } from "react-hook-form";
import { DateInput, Input, SelectInput } from './../../Components/Input/Input';
import { genderSelectValue, activityLevelSelectValue } from '../../../constants/selectInputValue';
import * as ImagePicker from 'expo-image-picker';

export default function UserInfo({ navigation, screenName }) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user) ?? useSelector((state) => state.user.register)

    const { handleSubmit, control, formState: { errors } } = useForm();
    const [image, setImage] = React.useState(null)

    const onSubmit = (data) => {
        if (user?.username) {
            const dataSend = {
                ...data,
                username: user.username,
                avatar: image?.base64 ?? null
            }

            try {
                axios.post(`${baseUrl}/api/auth/register/user-info`,
                    dataSend
                ).then((response) => {
                    const resData = response.data
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

    return (
        <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
            <ScrollView >
                <View style={styles.login} >
                    <View>
                        <Text style={{ marginBottom: 5, fontSize: 36, }}>
                            UserInfo
                        </Text>
                    </View>
                    <View style={styles.loginInputContainer}>


                        <View style={{ ...styles.middleCol }}>
                            <View style={{ ...styles.middleRow, marginBottom: -15, }}>
                                {
                                    image ?
                                        <Image
                                            source={{ uri: image.uri }}
                                            style={{ width: 200, height: 200, borderRadius: 300 }}
                                            resizeMode={'cover'}
                                        />
                                        :
                                        <Image
                                            source={require('../../../assets/empty-avatar.jpg')}
                                            style={{ width: 200, height: 200, borderRadius: 300 }}
                                            resizeMode={'cover'}
                                        />
                                }

                            </View>
                            <CustomButton
                                title='Choose Avatar'
                                titleStyle={{ fontSize: 16 }}
                                containerStyle={{
                                    borderRadius: 12,
                                    borderColor: "#C1C1C1", borderWidth: 1,
                                    backgroundColor: 'white',
                                }}
                                width={150}
                                height={36}
                                onPress={() => pickImage()}
                            />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='name' title='Name' control={control} rules={{ required: 'This is required' }} errors={errors} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <SelectInput name='gender' title='Gender' control={control} rules={{ required: 'This is required' }} errors={errors} values={genderSelectValue} initLable='What is your gender?' />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='height' title='Height' control={control} keyboardType='numeric' rules={{ required: 'This is required', validate: (val) => !Number.isInteger(val) && val > 0 || 'Please enter positive number' }} errors={errors} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='weight' title='Weight' control={control} keyboardType='numeric' rules={{ required: 'This is required', validate: (val) => !Number.isInteger(val) && val > 0 || 'Please enter positive number' }} errors={errors} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <SelectInput name='activityLevel' title='Activity' control={control} rules={{ required: 'This is required' }} errors={errors} values={activityLevelSelectValue} initLable='What is your Activity?' />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <DateInput name='DOB' title='Date of birth' control={control} rules={{ required: 'This is required', validate: (val) => val < Date.now() || 'Please check again' }} errors={errors} />
                        </View>

                    </View>

                    <View style={{ ...styles.middleRow, marginTop: 16, marginBottom: 24 }} >
                        <CustomButton
                            title='Complete'
                            buttonColor='red'
                            width={'60%'}
                            height={40}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>


                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    loginInput: {
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: "#20232a",
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
    },

    loginButton: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginInputContainer: {
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginInputWrapper: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: '100%',
    },

    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C4E8FF',
        borderRadius: 12,
        height: 30,
        width: 70,
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
});

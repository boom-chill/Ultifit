import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert, Pressable } from 'react-native';
import { baseUrl } from '../../../constants/url'
import axios from 'axios';
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage';

import { useSelector, useDispatch } from 'react-redux'
import { addUser, deleteUser } from '../../features/user/user'
import CustomButton from './../../Components/CustomButton/CustomButton';


export default function Login({ navigation, screenName }) {
    const dispatch = useDispatch()
    const [username, onChangeUsername] = React.useState("")
    const [password, onChangePassword] = React.useState("")
    const [error, setError] = React.useState(null)

    const postLogin = () => {
        if (username == '' || password == '') {
            setError('Please enter in full')
        } else {
            axios.post(`${baseUrl}/api/auth/login`, {
                username: username,
                password: password,
            }).then((response) => {
                const resData = response.data
                if (resData.error) {
                    setError(resData.message)
                } else {
                    setError(null)
                }

                dispatch(addUser(resData.message))
            })
        }


    }

    return (
        <View style={styles.login}>
            <View>
                <Text style={{ marginBottom: 5, fontSize: 36, }}>
                    LOGIN
                </Text>
            </View>

            {
                error
                    ? <View>
                        <ErrorMessage errorMessage={error} WrapperStyle={{ justifyContent: 'center' }} />
                    </View>
                    : <Text></Text>
            }
            <View style={styles.loginInputContainer}>

                <View style={styles.loginInputWrapper} >
                    <Text style={{ marginBottom: 5, fontSize: 16, color: '#343a40' }}>
                        Username
                    </Text>
                    <TextInput
                        onChangeText={onChangeUsername}
                        style={{ ...styles.loginInput, borderColor: '#C1C1C1' }}
                    />
                </View>


                <View style={styles.loginInputWrapper} >
                    <Text style={{ marginBottom: 5, fontSize: 16, color: '#343a40' }}>
                        Password
                    </Text>
                    <TextInput
                        onChangeText={onChangePassword}
                        style={{ ...styles.loginInput, borderColor: '#C1C1C1' }}
                        secureTextEntry={true}
                    />
                </View>
            </View>


            <View style={styles.middleRow} >
                <View style={{ marginRight: 5, }}>
                    <CustomButton
                        title='Login'
                        buttonColor='blue'
                        width={70}
                        height={30}
                        onPress={() => postLogin()}
                    />
                </View>


            </View>

            <View style={{ marginRight: 5, marginLeft: 15 }}>
                <Pressable
                    onPress={() => navigation.navigate('Register')}
                >
                    <View style={{ ...styles.middleRow, marginTop: 15 }}>
                        <Text style={{ color: 'gray' }}>Not a member? </Text>
                        <Text style={{ color: '#023e8a' }}>Register</Text>
                    </View>
                </Pressable>
            </View >


        </View >
    )
}

const styles = StyleSheet.create({
    login: {
        marginTop: -150,
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


});
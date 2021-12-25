import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert, Pressable } from 'react-native';
import tailwind from 'tailwind-rn';
import { baseUrl } from '../../../constants/url'
import axios from 'axios';
import { ErrorBoundary } from 'react-error-boundary'
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage';
import CustomButton from './../../Components/CustomButton/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { registerUserSuccess, registerUser, addUser } from '../../features/user/user'


export default function Register({ navigation }) {
    const [username, onChangeUsername] = React.useState("")
    const [password, onChangePassword] = React.useState("")
    const [passwordAgain, onChangePasswordAgain] = React.useState("")
    const [error, setError] = React.useState(null)
    const dispatch = useDispatch()

    const isMatchPassword = (pass, passAgain) => {
        if (pass == passAgain) return true
        return false
    }

    const postRegister = () => {
        if (username == '' || password == '') {
            setError('Please enter in full')
        } else {
            const isMatch = isMatchPassword(password, passwordAgain)
            if (!isMatch) {
                setError('Those passwords didn\'t match. Try again')
            }
            else {
                try {
                    axios.post(`${baseUrl}/api/auth/register`, {
                        username: username,
                        password: password,
                    }).then((response) => {
                        const resData = response.data
                        console.log(response.data)
                        if (resData.error) {
                            setError(resData.message)
                        } else {
                            setError(null)
                            dispatch(registerUser({
                                username: username,
                            }))

                            navigation.navigate('UserInfo')
                        }
                    })

                } catch (error) {
                    console.log('error', error)
                }
            }
        }
    }

    return (
        <View style={styles.login}>
            <View>
                <Text style={{ marginBottom: 5, fontSize: 36, }}>
                    REGISTER
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

                <View style={styles.loginInputWrapper} >
                    <Text style={{ marginBottom: 5, fontSize: 16, color: '#343a40' }}>
                        Confirm Password
                    </Text>
                    <TextInput
                        onChangeText={onChangePasswordAgain}
                        style={{ ...styles.loginInput, borderColor: '#C1C1C1' }}
                        secureTextEntry={true}
                    />
                </View>
            </View>


            <View style={styles.middleRow} >
                <View style={{ marginRight: 5, }}>
                    <CustomButton
                        title='Register'
                        buttonColor='blue'
                        width={80}
                        height={30}
                        onPress={() => postRegister()}
                    />
                </View>
            </View>

            <View style={{ marginRight: 5, marginLeft: 15 }}>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                >
                    <View style={{ ...styles.middleRow, marginTop: 15 }}>
                        <Text style={{ color: 'gray' }}>Have an Account </Text>
                        <Text style={{ color: '#023e8a' }}>Login</Text>
                    </View>
                </Pressable>
            </View >


        </View>
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
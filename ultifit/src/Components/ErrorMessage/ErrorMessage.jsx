import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';

const ErrorMessage = props => {
    const { errorMessage, WrapperStyle } = props

    return (
        <View
            name='error-message'
            style={styles.errorMessageWrapper}
        >
            {
                errorMessage
                    ?
                    <View style={{ ...styles.errorMessageWrapper, ...WrapperStyle }}>
                        <Icon name='info' color='red' size={18} />
                        <View style={{ marginLeft: 5, }}>
                            <Text style={{
                                color: 'red',
                                fontSize: 16,
                            }}>
                                {errorMessage}
                            </Text>
                        </View>
                    </View>
                    : <Text></Text>
            }
        </View>
    );
};


export default ErrorMessage;

const styles = StyleSheet.create({
    errorMessageWrapper: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        color: 'red',
        fontWeight: '500',
        marginBottom: 10,
    },

    errorMessage: {
        marginLeft: 15,
    },
});
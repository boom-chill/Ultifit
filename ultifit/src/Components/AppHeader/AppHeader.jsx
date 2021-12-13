import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { baseWideUri, baseWideUrl } from '../../../constants/url';

function AppHeader(props) {
    const { title } = props
    const user = useSelector((state) => state.user.user)
    let avaUrl = baseWideUrl + `/` + user.avatar
    if (!user?.avatar) {
        avaUrl = baseWideUrl + '/' + 'file/users/empty-avatar.jpg'
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerWrapper}>

                <View style={styles.headerAvatar}>
                    {
                        user ?
                            <Image
                                source={{ uri: avaUrl }}
                                style={{ width: 36, height: 36, borderRadius: 36 }}
                            /> : <View />
                    }
                </View>

                <View>
                    <Text style={styles.headerText}>
                        {title}
                    </Text>
                </View>

                <View>
                    <Image
                        source={require('../../../assets/icon-notification.png')}
                        style={{ width: 36, height: 36 }}
                    />
                </View>
            </View>
        </View>
    );
}

export default AppHeader;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        height: 70,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        elevation: 8,
    },

    headerWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 12,
        marginRight: 12,
        height: '100%',
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#121212',
    },

    headerAvatar: {
        height: 36,
        width: 36,
        borderRadius: 36,
    }
});
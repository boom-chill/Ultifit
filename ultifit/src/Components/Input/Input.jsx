import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { useController } from "react-hook-form";
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomButton from './../CustomButton/CustomButton';

export function Input({ title, keyboardType, name, control, rules, errors, defaultValue, numberOfLines, inputStyle, placeholder, onChangeText, secureTextEntry }) {
    const { field } = useController({
        name,
        control,
        defaultValue: String(defaultValue || ''),
        rules: rules,
    })
    return (
        <View style={styles.inputWrapper} >
            <Text style={{ marginBottom: 5, fontSize: 16, color: '#6E6E6E' }}>
                {title}
            </Text>
            <TextInput
                //value={field.value}
                secureTextEntry={secureTextEntry}
                numberOfLines={numberOfLines}
                multiline={numberOfLines ? true : false}
                defaultValue={String(defaultValue || '')}
                onChangeText={onChangeText ? onChangeText : field.onChange}
                keyboardType={keyboardType}
                placeholder={placeholder}
                style={{ ...styles.input, borderColor: '#C1C1C1', height: 36, ...inputStyle }}
            />
            {
                errors[name] ? <ErrorMessage errorMessage={errors[name].message} /> : <View />
            }
        </View>
    )
}

export function SelectInput({ title, initLable, values, name, control, rules, errors, defaultValue }) {
    const { field } = useController({
        name,
        control,
        defaultValue: defaultValue ?? '',
        rules: rules,
    })

    console.log(field.name == name ? field.value && field.value?.defaultValue : "")
    return (
        <View style={styles.inputWrapper} >
            <Text style={{ marginBottom: 5, fontSize: 16, color: '#6E6E6E' }}>
                {title}
            </Text>
            <View style={{ ...styles.select, borderColor: '#C1C1C1' }}>
                <Picker
                    selectedValue={field.name == name ? field.value : ""}
                    onValueChange={field.onChange}
                    style={{ height: 36, bottom: 8 }}
                >
                    <Picker.Item label={initLable} value={''} />
                    {
                        values.map((item, item_idx) => (
                            <Picker.Item key={item_idx} label={item.label} value={item.value} />
                        ))
                    }
                </Picker>
            </View>
            {
                errors[name] ? <ErrorMessage errorMessage={errors[name].message} /> : <View />
            }

        </View>
    )
}

export function DateInput({ title, initLable, values, name, control, rules, errors, defaultValue }) {
    const { field } = useController({
        name,
        control,
        defaultValue: defaultValue || '',
        rules: rules,
    })
    const [date, setDate] = React.useState(new Date(defaultValue))
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (callback, date) => {
        hideDatePicker();
        setDate(date)
        return callback(date)
    };

    React.useEffect(() => {
        handleConfirm(field.onChange, new Date(defaultValue))
    }, [])

    const dateSplit = String(date).split(' ')
    const dateForomated = dateSplit[2] + ' ' + dateSplit[1] + ' ' + dateSplit[3]

    return (
        <View style={styles.inputWrapper} >
            <Text style={{ marginBottom: 5, fontSize: 16, color: '#6E6E6E' }}>
                {title}
            </Text>

            <View style={{ ...styles.select, borderColor: '#C1C1C1' }}>
                <CustomButton title={dateForomated} onPress={showDatePicker} height={36} buttonStyle={{ alignItems: 'flex-start', paddingLeft: 10, width: '100%' }} containerStyle={{ alignItems: 'flex-start', }} />
                <DateTimePickerModal
                    date={date}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(val) => handleConfirm(field.onChange, val)}
                    onCancel={hideDatePicker}
                    modalStyleIOS={{ color: '#C4E8FF' }}
                />
            </View>
            {
                errors[name] ? <ErrorMessage errorMessage={errors[name].message} /> : <View />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: '100%',
    },

    input: {
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: "#20232a",
        borderWidth: 1,
        width: '100%',
        marginBottom: 5,
    },

    select: {
        borderRadius: 5,
        borderColor: "#20232a",
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
    }
});

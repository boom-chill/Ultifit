import React from 'react'
import { Text, View, ScrollView, Button, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { baseUrl } from '../../../constants/url'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { addHistories } from '../../features/histories/histories';
import { kFormatter } from './../../utils/kFormatter';
import { dateFormat } from '../../utils/dateFormat';
import { Input } from '../../../src/Components/Input/Input';
import { useForm } from "react-hook-form";
import CustomButton from './../../Components/CustomButton/CustomButton';

function Summary(props) {
    const { handleSubmit, control, formState: { errors }, watch } = useForm();

    const today = new Date()
    const user = useSelector((state) => state.user.user)
    const histories = useSelector((state) => state.history.histories)
    const dispatch = useDispatch()

    const [isInputWater, setIsInputWater] = React.useState(false)

    const [viewCol, setViewCol] = React.useState(null)

    const [waterMass, setWaterMass] = React.useState(0)


    const [year, setYear] = React.useState(new Date().getFullYear())




    const [dayStatistic, setDayStatistic] = React.useState(null)


    const statistical = (summary, nowYear) => {
        let reses = []

        let nowMonth = 12

        let maxYear = (new Date(summary[0]?.time)).getYear() + 1900
        let minYear = (new Date(summary[summary.length - 1]?.time)).getYear() + 1900

        let calIn = 0
        let calOut = 0

        let biggestCal = 0


        if (maxYear < nowYear || minYear > nowYear) {

            for (let i = 12; i > 0; i--) {
                reses.push({
                    auto: true,
                    month: i,
                    calIn: 0,
                    calOut: 0,
                    calInRate: 0,
                    calOutRate: 0,
                })
            }


            return { resArr: reses, biggestCal: 0 }
        }

        let maxMonth = 1
        for (let y = 0; y < summary.length; y++) {

            const ele = summary[y]

            const year = (new Date(ele?.time)).getYear() + 1900
            const month = (new Date(ele?.time)).getMonth() + 1

            if (nowYear == year) {
                if (month >= 1 || month <= 12) {
                    if (month > maxMonth) {
                        maxMonth = month
                    }
                }
            }
        }


        for (let i = nowMonth; i > maxMonth; i--) {
            reses.push({
                auto: true,
                month: i,
                calIn: 0,
                calOut: 0,
                calInRate: 0,
                calOutRate: 0,
            })
        }

        nowMonth = maxMonth

        for (let y = 0; y < summary.length; y++) {

            const ele = summary[y]

            const year = (new Date(ele?.time)).getYear() + 1900
            const month = (new Date(ele?.time)).getMonth() + 1

            if (nowYear == year) {

                if (month >= 1 || month <= 12) {

                    if (month == nowMonth) {

                        if (ele.type == 'food') {
                            calIn += ele.calories
                        }
                        if (ele.type == 'session') {
                            calOut += ele.calories
                        }

                    } else {

                        const res = {
                            month: nowMonth,
                            calIn: calIn,
                            calOut: calOut,
                        }

                        reses.push(res)

                        // check biggest calories
                        if (biggestCal < (calIn + calOut)) {
                            biggestCal = (calIn + calOut)
                        }


                        if (ele.type == 'food') {
                            calIn = ele.calories
                            calOut = 0
                        }
                        if (ele.type == 'session') {
                            calIn = 0
                            calOut = ele.calories
                        }

                        nowMonth -= 1
                    }
                }

            }
            if (year == nowYear - 1 || summary.length - 1 == y) {
                const res = {
                    month: nowMonth,
                    calIn: calIn,
                    calOut: calOut,
                }

                reses.push(res)

                if (biggestCal < (calIn + calOut)) {
                    biggestCal = (calIn + calOut)
                }

                if (nowMonth != 1) {
                    nowMonth = month

                    for (let i = nowMonth - 1; i > 0; i--) {
                        reses.push({
                            auto: true,
                            month: i,
                            calIn: 0,
                            calOut: 0,
                            calInRate: 0,
                            calOutRate: 0,
                        })
                    }
                }

                reses.forEach((ele, idx) => {
                    let calInRate = 0
                    let calOutRate = 0
                    if (ele.calIn != 0 || ele.calOut != 0) {
                        calInRate = ele.calIn / biggestCal
                        calOutRate = ele.calOut / biggestCal
                    }

                    reses[idx] = {
                        ...reses[idx],
                        calInRate,
                        calOutRate,
                    }
                })

                return { resArr: reses, biggestCal: biggestCal }
            }
        }


        for (let i = nowMonth; i > 0; i--) {
            reses.push({
                auto: true,
                month: i,
                calIn: 0,
                calOut: 0,
                calInRate: 0,
                calOutRate: 0,
            })
        }

        reses.forEach((ele, idx) => {
            let calInRate = 0
            let calOutRate = 0
            if (ele.calIn != 0 || ele.calOut != 0) {
                calInRate = ele.calIn / biggestCal
                calOutRate = ele.calOut / biggestCal
            }

            reses[idx] = {
                ...reses[idx],
                calInRate,
                calOutRate,
            }
        })

        return { resArr: reses, biggestCal: biggestCal }
    }

    const dayStatistical = () => {
        const start = new Date()
        start.setHours(0, 0, 0, 0)

        const end = new Date()
        end.setHours(23, 59, 59, 999)

        let calIn = 0
        let calOut = 0
        let carb = 0
        let fat = 0
        let protein = 0


        histories.forEach((ele) => {
            const timer = new Date(ele.time)
            if (timer > start && timer < end) {
                if (ele.type == 'food') {
                    calIn += ele.calories
                    carb += ele.carb
                    fat += ele.fat
                    protein += ele.protein
                }

                if (ele.type == 'session') {
                    calOut += ele.calories
                }
            }
        })

        if (calIn == 0 && calOut == 0) {
            setDayStatistic({
                calOut: calOut,
                calIn: calIn,
                calInRate: 0,
                calOutRate: 0,
                carb: carb,
                fat: fat,
                protein: protein,
            })
        } else {

            setDayStatistic({
                calOut: calOut,
                calIn: calIn,
                calInRate: (calIn / (calIn + calOut)),
                calOutRate: (calOut / (calIn + calOut)),
                carb: carb,
                fat: fat,
                protein: protein,
            })
        }
    }

    React.useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/histories`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        setViewCol(statistical(resData, year))
                        dispatch(addHistories(resData))
                        dayStatistical(resData)
                    } else {
                        console.log(response.data.message)
                    }
                })
        } catch (error) {

        }

        try {
            axios.get(`${baseUrl}/api/histories/drink`, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const error = response.data?.error
                    if (!error) {
                        const resData = response.data.message
                        setWaterMass(resData.mass)
                    } else {
                        console.log(response.data.message)
                    }
                })
        } catch (error) {

        }
    }, [])

    const nextYear = (year) => {
        setViewCol(statistical(histories, year + 1))
        setYear(year + 1)
    }

    const prevYear = (year) => {
        setViewCol(statistical(histories, year - 1))
        setYear(year - 1)
    }

    const onSubmit = (data) => {
        try {
            axios.post(`${baseUrl}/api/histories/drink`, {
                mass: Number(data.waterMass)
            }, {
                params: {
                    username: user.username
                }
            })
                .then((response) => {
                    const resData = response.data.message
                    setWaterMass(resData.mass)
                    setIsInputWater(false)
                })
        } catch (error) {

        }
    }

    React.useEffect(() => {
        dayStatistical(histories)
        setViewCol(statistical(histories, year))
    }, [histories])



    if (!dayStatistic && !viewCol) {
        return (
            <View style={{ ...styles.container }}>

            </View>
        )
    }



    return (
        <View style={{ ...styles.container }}>
            <ScrollView style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%', ...styles.middleCol, marginTop: 16 }}>

                    <View style={{ ...styles.summaryChartContainer }}>
                        <View style={{ marginVertical: 10, ...styles.middleRow }} >
                            <TouchableOpacity
                                onPress={() => prevYear(year)}
                            >
                                <Image source={
                                    require('../../../assets/icon-left-arrow.png')
                                }
                                    style={{ width: 24, height: 24 }}
                                />

                            </TouchableOpacity>

                            <Text style={{ fontSize: 24, marginHorizontal: 30 }}>
                                {year}
                            </Text>

                            <TouchableOpacity
                                onPress={() => nextYear(year)}
                            >
                                <Image source={
                                    require('../../../assets/icon-left-arrow.png')
                                }
                                    style={{ width: 24, height: 24, transform: [{ rotate: '180deg' }] }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ ...styles.summaryChart, }}>
                            {
                                viewCol.resArr.map((col, idx) => (
                                    <View style={{ height: '100%' }} key={idx}>
                                        <View style={{ width: '100%', ...styles.middleCol }}>
                                            <View style={{ ...styles.summaryBackgroundCol, ...styles.middleCol, justifyContent: 'flex-end', backgroundColor: (11 - idx == new Date().getMonth() && year == new Date().getFullYear() ? '#FEC89A' : '#EFF3FE') }}>
                                                {
                                                    viewCol ?
                                                        (<>
                                                            <View style={{ height: (col?.calInRate * 110), width: 8, borderRadius: 10, backgroundColor: '#C19EE0' }}>

                                                            </View>

                                                            <View style={{ height: (col?.calOutRate * 110 ?? 0) < 1 && col?.calOutRate * 110 != 0 ? 2 : col?.calOutRate * 110, width: 8, borderRadius: 10, backgroundColor: '#F07167', marginTop: (col?.calIn == 0 || col?.calOut == 0 ? 0 : 10) }}>

                                                            </View>
                                                        </>
                                                        )
                                                        : <View></View>
                                                }
                                            </View>
                                            <Text style={{ color: '#BACCFD', fontSize: 12 }}>
                                                {col?.month >= 10 ? col?.month : '0' + col?.month}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>

                    </View>
                    <View style={{ width: '100%', ...styles.middleCol, marginTop: 24 }}>
                        <Text style={{ fontSize: 24, fontWeight: '800' }}>
                            {
                                `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
                            } Summary
                        </Text>
                        <View style={{ ...styles.summaryChartContainer, marginTop: 8, justifyContent: 'center', height: 'auto', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>

                            <View style={{ ...styles.middleCol, alignItems: 'flex-start' }}>
                                <View style={{ ...styles.middleRow, marginBottom: 16 }}>
                                    <View style={{ width: 60, height: 65, backgroundColor: '#FFEEDF', borderRadius: 10, ...styles.middleRow }}>

                                        <Image
                                            source={require('../../../assets/meat.png')}
                                            style={{ width: 48, height: 48 }}
                                        />
                                    </View>

                                    <View style={{ marginLeft: 14 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                            {
                                                kFormatter(dayStatistic.protein)
                                            }g
                                        </Text>
                                        <Text style={{ color: '#727272', fontSize: 15 }}>
                                            Protein
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.middleRow }}>
                                    <View style={{ width: 60, height: 65, backgroundColor: '#FFEEDF', borderRadius: 10, ...styles.middleRow }}>

                                        <Image
                                            source={require('../../../assets/barley.png')}
                                            style={{ width: 48, height: 48 }}
                                        />
                                    </View>

                                    <View style={{ marginLeft: 14 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                            {
                                                kFormatter(dayStatistic.carb)
                                            }g
                                        </Text>
                                        <Text style={{ color: '#727272', fontSize: 15 }}>
                                            Carb
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ ...styles.middleCol, alignItems: 'flex-start' }}>


                                <View style={{ ...styles.middleRow, marginBottom: 16 }}>
                                    <View style={{ width: 60, height: 65, backgroundColor: '#FFEEDF', borderRadius: 10, ...styles.middleRow }}>

                                        <Image
                                            source={require('../../../assets/trans-fat.png')}
                                            style={{ width: 48, height: 48 }}
                                        />
                                    </View>

                                    <View style={{ marginLeft: 14 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                            {
                                                kFormatter(dayStatistic.fat)
                                            }g
                                        </Text>
                                        <Text style={{ color: '#727272', fontSize: 15 }}>
                                            Fat
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ ...styles.middleRow }}>
                                    <View style={{ width: 60, height: 65, backgroundColor: '#FFEEDF', borderRadius: 10, ...styles.middleRow }}>

                                        <Image
                                            source={require('../../../assets/light.png')}
                                            style={{ width: 48, height: 48 }}
                                        />
                                    </View>

                                    <View style={{ marginLeft: 14 }}>
                                        <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                            {
                                                kFormatter(dayStatistic.calIn)
                                            }
                                        </Text>
                                        <Text style={{ color: '#727272', fontSize: 15 }}>
                                            Calories in
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>

                    <View style={{ width: '96%', ...styles.middleRow, justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 16 }}>
                        <View
                            style={{ ...styles.summaryChartContainer, width: '44%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10 }}
                        >
                            <View style={{ ...styles.middleRow, marginBottom: 24 }}>
                                <View style={{ width: 60, height: 65, backgroundColor: '#FFCFCB', borderRadius: 10, ...styles.middleRow }}>

                                    <Image
                                        source={require('../../../assets/fire.png')}
                                        style={{ width: 48, height: 48 }}
                                    />
                                </View>

                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                        {
                                            kFormatter(dayStatistic.calOut)
                                        }
                                    </Text>
                                    <Text style={{ color: '#727272', fontSize: 15 }}>
                                        Calories
                                    </Text>
                                </View>
                            </View>

                            <View style={{ width: '100%', ...styles.middleCol, marginBottom: 24 }}>
                                <View style={{ width: '100%', ...styles.middleCol }}>

                                    <View style={{ ...styles.middleRow, backgroundColor: '#E0E8FF', height: 5, width: 120, justifyContent: 'space-between', marginBottom: 5 }}>

                                        {
                                            dayStatistic ?
                                                <View style={{ width: (dayStatistic?.calOutRate ?? 0) * 110, height: 8, borderRadius: 10, backgroundColor: '#F07167' }}>
                                                </View>
                                                : <View></View>
                                        }


                                    </View>
                                </View>
                                <Text style={{ color: '#595959' }}>
                                    {
                                        'Out: ' + (dayStatistic.calOut).toFixed(0)
                                    }
                                </Text>
                            </View>

                            <View style={{ width: '100%', ...styles.middleCol }}>
                                <View style={{ width: '100%', ...styles.middleCol, marginBottom: 5 }}>

                                    <View style={{ ...styles.middleRow, backgroundColor: '#E0E8FF', height: 5, width: 120, justifyContent: 'space-between' }}>


                                        {
                                            dayStatistic ?
                                                <View style={{ width: (dayStatistic?.calInRate ?? 0) * 110, height: 8, borderRadius: 10, backgroundColor: '#C19EE0' }}>
                                                </View>
                                                : <View></View>
                                        }


                                    </View>
                                </View>
                                <Text style={{ color: '#595959' }}>
                                    {
                                        'In: ' + (dayStatistic.calIn).toFixed(0)
                                    }
                                </Text>
                            </View>

                        </View>

                        <TouchableOpacity style={{ ...styles.summaryChartContainer, width: '52%', height: 'auto', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10 }}
                            onPress={() => setIsInputWater(!isInputWater)}

                        >
                            <View style={{ ...styles.middleRow, marginBottom: 24 }}>
                                <View style={{ width: 60, height: 65, backgroundColor: '#DAF1FF', borderRadius: 10, ...styles.middleRow }}>

                                    <Image
                                        source={require('../../../assets/water.png')}
                                        style={{ width: 31, height: 48 }}
                                    />
                                </View>

                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: 24, fontWeight: '700' }}>
                                        {
                                            waterMass
                                        }ml
                                    </Text>
                                    <Text style={{ color: '#727272', fontSize: 15 }}>
                                        Water
                                    </Text>
                                </View>
                            </View>
                            {
                                isInputWater ?
                                    <View style={{ width: '100%' }} >
                                        <Input name='waterMass' title='Amount of water' control={control} rules={{ required: 'This is required' }} errors={errors} inputStyle={{ width: '100%' }} keyboardType={'numeric'} placeholder={'ml'} defaultValue={watch('waterMass' || waterMass)} />

                                        <CustomButton
                                            title='Drink'
                                            buttonColor='blue'
                                            width={'45%'}
                                            height={40}
                                            borderRadius={12}
                                            fontSize={14}
                                            type={'submit'}
                                            onPress={handleSubmit(onSubmit)}
                                        />
                                    </View>
                                    :
                                    <View

                                    >


                                        <View style={{ ...styles.middleRow, flexWrap: 'wrap' }}>
                                            {
                                                Array.apply(null, { length: 8 }).map((ele, idx) => (
                                                    <View key={idx} style={{ marginBottom: 8 }}>
                                                        {
                                                            idx <= (waterMass / 250) - 1 ?
                                                                <Image
                                                                    source={require('../../../assets/water-glass.png')}
                                                                    style={{ width: 40, height: 40 }}
                                                                /> :
                                                                <Image
                                                                    source={require('../../../assets/empty-water-glass.png')}
                                                                    style={{ width: 40, height: 40 }}
                                                                />

                                                        }
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    </View>
                            }

                        </TouchableOpacity>

                    </View>


                </View>
            </ScrollView >
        </View >
    )
}

export default Summary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },

    summaryChartContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '96%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        height: 240,
    },

    summaryChart: {
        width: '96%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse'
    },

    summaryBackgroundCol: {
        borderRadius: 10,
        height: 130,
        width: 5,
        backgroundColor: '#EFF3FE',
        marginBottom: 5,
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

    middleRowSpaceBetween: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

})
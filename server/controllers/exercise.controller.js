import { exerciseModel } from './../models/exerciseModel.js';

export const getExercises = async (req, res) => {
    console.log('Get Exercises')
    try {
        const exercises = await exerciseModel.find({})

        res.json({
            error: false,
            message: exercises,
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}
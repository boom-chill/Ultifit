import * as fs from 'fs';
import stream from 'stream'
import { foodIngredientModel } from './../models/foodIngredientModel.js';

export const getIngredients = async (req, res) => {
    console.log('Get Ingredients')
    try {
        const ingredients = await foodIngredientModel.find({})

        res.json({
            error: false,
            message: ingredients,
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}
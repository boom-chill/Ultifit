import { userModel } from '../models/userModel.js';
import dotenv from 'dotenv'
import * as fs from 'fs';
import { TDEECal } from '../utils/calculator.js';
import { v4 as uuidv4 } from 'uuid'
import { foodModel } from './../models/foodModel.js';
import { foodIngredientModel } from './../models/foodIngredientModel.js';

export const postFood = async (req, res) => {
    console.log('enter postFood')
    try {
        let data = req.body.data

        const newImg = req.body?.img

        const imgId = uuidv4()
        
        if( newImg ) {
            const binaryData = new Buffer(newImg, 'base64')

            fs.writeFileSync(`public/foods/${data.name}-${imgId}-img.jpeg`, binaryData, "binary", function(err) {
                console.log(err);
            });

            data = {
                ...data,
                thumbnail: `file/foods/${data.name}-${imgId}-img.jpeg`
            }
        } else {
            data = {
                ...data,
                thumbnail: null,
            }
        }


        const newFood = foodModel({
            ...data,
        })

        await newFood.save()

        res.json({
            message: 'sc',
            error: false,
        })

    } catch (error) {
        console.log(error)
            res.json({
                message: error,
                error: false,
            })
    }
}

export const getFood = async (req, res) => {
    console.log('enter getFood')
    const username = req.query.username
    try {
        let newFoods = []
        
        let foods = await foodModel.find(
            {author: username}, 
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const food of foods) {
            let newIngredients = [] 

            for (const ingredient of food.ingredients) {
                let newIngredient = {}

                const mongIngredient = await foodIngredientModel.findOne(
                    {_id: ingredient._ingerdientID},
                    {author: 0, type: 0, fiber: 0}
                )

                newIngredient = {
                    ...mongIngredient._doc,
                    mass: ingredient.mass
                }

                newIngredients.push(newIngredient)
            }

            newFoods = [...newFoods, {
                ...food._doc,
                ingredients: newIngredients
            }]
        }


        
        res.json({
            message: newFoods,
            error: false,
        })

    } catch (error) {
        console.log(error)
            res.json({
                message: error,
                error: false,
            })
    }
}
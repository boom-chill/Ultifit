import { userModel } from '../models/userModel.js';
import dotenv from 'dotenv'
import * as fs from 'fs';
import { TDEECal } from '../utils/calculator.js';
import { v4 as uuidv4 } from 'uuid'
import { foodModel } from './../models/foodModel.js';
import { foodIngredientModel } from './../models/foodIngredientModel.js';

const getFoodScript = async (username) => {
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
                {_id: ingredient._id},
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

        return newFoods
    }

}

export const postFood = async (req, res) => {
    console.log('Post Food')
    try {
        const username = req.query.username
        let data = req.body.data

        const newImg = req.body?.img

        const imgId = uuidv4()
        
        if( newImg ) {
            const binaryData = new Buffer(newImg, 'base64')

            fs.writeFileSync(`public/foods/${encodeURI(data.name)}-${imgId}-img.jpeg`, binaryData, "binary", function(err) {
                console.log(err);
            });

            data = {
                ...data,
                thumbnail: `file/foods/${encodeURI(data.name)}-${imgId}-img.jpeg`
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

        let newFoods = []
        
        let foods = await foodModel.find(
            {author: username, hide: false}, 
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const food of foods) {
            let newIngredients = [] 

            for (const ingredient of food.ingredients) {
                let newIngredient = {}

                const mongIngredient = await foodIngredientModel.findOne(
                    {_id: ingredient._id},
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

export const getFood = async (req, res) => {
    console.log('Get Food')
    try {
        const username = req.query.username
        let newFoods = []
        
        let foods = await foodModel.find(
            {author: username, hide: false},  
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const food of foods) {
            let newIngredients = [] 

            for (const ingredient of food.ingredients) {
                let newIngredient = {}

                const mongIngredient = await foodIngredientModel.findOne(
                    {_id: ingredient._id},
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

export const patchFood = async (req, res) => {
    console.log('Patch Food')
    try {
        const username = req.query.username
        let data = req.body.data

        const newImg = req.body?.img

        const imgId = uuidv4()
        
        if( newImg ) {
            const binaryData = new Buffer(newImg, 'base64')

            fs.writeFileSync(`public/foods/${encodeURI(data.name)}-${imgId}-img.jpeg`, binaryData, "binary", function(err) {
                console.log(err);
            });

            data = {
                ...data,
                thumbnail: `file/foods/${encodeURI(data.name)}-${imgId}-img.jpeg`
            }
        }

        //UPDATE FOOD
        await foodModel.findOneAndUpdate({_id: data._id},{
            ...data,
        })

        //GET FOODS
        let newFoods = []
        
        let foods = await foodModel.find(
            {author: username, hide: false}, 
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const food of foods) {
            let newIngredients = [] 

            for (const ingredient of food.ingredients) {
                let newIngredient = {}

                const mongIngredient = await foodIngredientModel.findOne(
                    {_id: ingredient._id},
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

export const deleteFood = async (req, res) => {
    console.log('Delete Food')
    const id = req.params.id
    const username = req.query.username
    
    try {

        //DELETE
        await foodModel.findOneAndUpdate({_id: id}, {
            hide: true,
        })

        //GET FOOD
        let newFoods = []
        
        let foods = await foodModel.find(
            {author: username, hide: false}, 
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const food of foods) {
            let newIngredients = [] 

            for (const ingredient of food.ingredients) {
                let newIngredient = {}

                const mongIngredient = await foodIngredientModel.findOne(
                    {_id: ingredient._id},
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

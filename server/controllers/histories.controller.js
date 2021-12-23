import * as fs from 'fs';
import stream from 'stream'
import { foodModel } from '../models/foodModel.js';
import { userModel } from '../models/userModel.js';
import { foodIngredientModel } from './../models/foodIngredientModel.js';

export const postHistory = async (req, res) => {
    console.log('Post History')
    try {
        const username = req.query.username
        const data = req.body

        const user = await userModel.findOne({username: username})

        console.log({
            ...user._doc,
            histories: {
                ...user._doc.histories,
                eaten: [
                    ...(user._doc.histories?.eaten),
                    data
                ]
                
            }
        })

        await userModel.findOneAndUpdate({username: username}, {
            ...user._doc,
            histories: {
                ...user._doc.histories,
                eaten: [
                    ...(user._doc.histories?.eaten),
                    data
                ]
                
            }
        }).select({ password: 0})

        let newUser = await userModel.findOne({username: username})

         //GET FOOD
         let newFoodHistories = []
         for (const foodHistory of newUser.histories.eaten) {
         
             let food = await foodModel.findOne(
                 {_id: foodHistory._id}, 
                 {createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
             )

             const newFood = {
                 ...food._doc,
                 time: foodHistory.time
             }

             newFoodHistories.push(newFood)
         }



        res.json({
            error: false,
            message: newFoodHistories,
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}

export const deleteFoodHistory = async (req, res) => {
    console.log('Delete History')
    
    const time = req.params.time
    console.log("Delete Time", time)
    // try {
    //     const username = req.query.username

    //     const user = await userModel.findOne({username: username})

    //     console.log({
    //         ...user._doc,
    //         histories: {
    //             ...user._doc.histories,
    //             eaten: [
    //                 ...(user._doc.histories?.eaten),
    //                 data
    //             ]
                
    //         }
    //     })

    //     await userModel.findOneAndUpdate({username: username}, {
    //         ...user._doc,
    //         histories: {
    //             ...user._doc.histories,
    //             eaten: [
    //                 ...(user._doc.histories?.eaten),
    //                 data
    //             ]
                
    //         }
    //     }).select({ password: 0})

    //     let newUser = await userModel.findOne({username: username})

    //      //GET FOOD
    //      let newFoodHistories = []
    //      for (const foodHistory of newUser.histories.eaten) {
         
    //          let food = await foodModel.findOne(
    //              {_id: foodHistory._id}, 
    //              {createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
    //          )

    //          const newFood = {
    //              ...food._doc,
    //              time: foodHistory.time
    //          }

    //          newFoodHistories.push(newFood)
    //      }



    //     res.json({
    //         error: false,
    //         message: newFoodHistories,
    //     })
    // } catch (error) {
    //     console.log('error', error)
    //     res.json({
    //         error: true,
    //         message: error
    //     })
    // }
}
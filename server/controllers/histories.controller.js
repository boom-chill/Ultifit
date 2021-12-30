import * as fs from 'fs';
import stream from 'stream'
import { foodModel } from '../models/foodModel.js';
import { historiesModel } from '../models/historiesModel.js';
import { sessionModel } from '../models/sessionModel.js';
import { userModel } from '../models/userModel.js';
import { foodIngredientModel } from './../models/foodIngredientModel.js';

export const getHistory = async (req, res) => {
    console.log('Get History')
    try {
        const username = req.query.username

        let hitories = await historiesModel.find(
            {author: username}, 
            {createdAt: 0, updatedAt: 0, __v: 0,})
        .sort({time: "desc"})

        //GET HISTORIES
       let newHistories = []
       for (const history of hitories) {
           
           if(history.type == 'food') {
               let food = await foodModel.findOne(
                   {_id: history._foodID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
               )

               const newFood = {
                   ...food?._doc,
                   _id: history._id,
                   time: history.time,
                   
                   name: history.name,
                   type: 'food',
                   calories: history.calories,
               }

               newHistories.push(newFood)
           } else if (history.type == 'session') {
               let session = await sessionModel.findOne(
                   {_id: history._sessionID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, author: 0, description: 0}
               )

               const newSession = {
                   ...session?._doc,
                   _id: history._id,
                   time: history.time,

                   name: history.name,
                   type: 'session',
                   calories: history.calories,
                   totalTime: history.totalTime,
               }

               newHistories.push(newSession)
           }

       }
       

       res.json({
           error: false,
           message: newHistories,
       })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}

export const postHistory = async (req, res) => {
    console.log('Post History')
    try {
        const data = req.body
        const username = req.query.username

        const newAddHistories = new historiesModel({
            ...data
        })

        await newAddHistories.save()

        let hitories = await historiesModel.find({
            author: username,
        }, {createdAt: 0, updatedAt: 0, __v: 0,}).sort({time: "desc"})

        //GET HISTORIES
        let newHistories = []
        for (const history of hitories) {
            
            if(history.type == 'food') {
                let food = await foodModel.findOne(
                    {_id: history._foodID}, 
                    {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
                )
 
                const newFood = {
                    ...food?._doc,
                    _id: history._id,
                    time: history.time,
                    
                    name: history.name,
                    type: 'food',
                    calories: history.calories,
                }
 
                newHistories.push(newFood)
            } else if (history.type == 'session') {
                let session = await sessionModel.findOne(
                    {_id: history._sessionID}, 
                    {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, author: 0, description: 0}
                )
 
                const newSession = {
                    ...session?._doc,
                    _id: history._id,
                    time: history.time,
 
                    name: history.name,
                    type: 'session',
                    calories: history.calories,
                    totalTime: history.totalTime,
                }
 
                newHistories.push(newSession)
            }
 
        }
        
 
        res.json({
            error: false,
            message: newHistories,
        })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}

export const deleteHistory = async (req, res) => {
    console.log('Delete History')
    try {
        const id = req.params.id
        const username = req.query.username

        await historiesModel.findOneAndDelete({_id: id})

        let hitories = await historiesModel.find({
            author: username,
        }, {createdAt: 0, updatedAt: 0, __v: 0,}).sort({time: "desc"})

       //GET HISTORIES
       let newHistories = []
       for (const history of hitories) {
           
           if(history.type == 'food') {
               let food = await foodModel.findOne(
                   {_id: history._foodID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
               )

               const newFood = {
                   ...food?._doc,
                   _id: history._id,
                   time: history.time,
                   
                   name: history.name,
                   type: 'food',
                   calories: history.calories,
               }

               newHistories.push(newFood)
           } else if (history.type == 'session') {
               let session = await sessionModel.findOne(
                   {_id: history._sessionID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, author: 0, description: 0}
               )

               const newSession = {
                   ...session?._doc,
                   _id: history._id,
                   time: history.time,

                   name: history.name,
                   type: 'session',
                   calories: history.calories,
                   totalTime: history.totalTime,
               }

               newHistories.push(newSession)
           }

       }
       

       res.json({
           error: false,
           message: newHistories,
       })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}

export const patchHistory = async (req, res) => {
    console.log('Patch History')
    try {
        const id = req.params.id
        const username = req.query.username
        const time = req.body.time

        await historiesModel.findOneAndUpdate({_id: id}, {
            time: time
        })

        let hitories = await historiesModel.find({
            author: username,
        }, {createdAt: 0, updatedAt: 0, __v: 0,}).sort({time: "desc"})

      //GET HISTORIES
       let newHistories = []
       for (const history of hitories) {
           
           if(history.type == 'food') {
               let food = await foodModel.findOne(
                   {_id: history._foodID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, ingredients: 0, author: 0, description: 0}
               )

               const newFood = {
                   ...food?._doc,
                   _id: history._id,
                   time: history.time,
                   
                   name: history.name,
                   type: 'food',
                   calories: history.calories,
               }

               newHistories.push(newFood)
           } else if (history.type == 'session') {
               let session = await sessionModel.findOne(
                   {_id: history._sessionID}, 
                   {_id: 0, createdAt: 0, updatedAt: 0, __v: 0, author: 0, description: 0}
               )

               const newSession = {
                   ...session?._doc,
                   _id: history._id,
                   time: history.time,

                   name: history.name,
                   type: 'session',
                   calories: history.calories,
                   totalTime: history.totalTime,
               }

               newHistories.push(newSession)
           }

       }
       

       res.json({
           error: false,
           message: newHistories,
       })
    } catch (error) {
        console.log('error', error)
        res.json({
            error: true,
            message: error
        })
    }
}
import { userModel } from '../models/userModel.js';
import dotenv from 'dotenv'
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid'
import { sessionModel } from './../models/sessionModel.js';
import { exerciseModel } from './../models/exerciseModel.js';

export const postSession = async (req, res) => {
    console.log('Post Session')
    try {
        const username = req.query.username
        let data = req.body.data

        const newImg = req.body?.img

        const imgId = uuidv4()
        
        if( newImg ) {
            const binaryData = new Buffer(newImg, 'base64')

            fs.writeFileSync(`public/exercises/${encodeURI(data.name)}-${imgId}-img.jpeg`, binaryData, "binary", function(err) {
                console.log(err);
            });

            data = {
                ...data,
                thumbnail: `file/exercises/${encodeURI(data.name)}-${imgId}-img.jpeg`
            }
        } else {
            data = {
                ...data,
                thumbnail: null,
            }
        }


        const newSession = sessionModel({
            ...data,
        })

        await newSession.save()

     
        let newSessions = []
        
        let sessions = await sessionModel.find(
            {author: username, hide: false},  
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const ss of sessions) {
            let newExercises = [] 

            for (const ex of ss.exercises) {

                const mongExercise = await exerciseModel.findOne(
                    {_id: ex._id},
                    {author: 0, type: 0, fiber: 0}
                )

                newExercises.push({...mongExercise._doc})
            }

            newSessions = [...newSessions, {
                ...ss._doc,
                exercises: newExercises
            }]
        }
        
        res.json({
            message: newSessions,
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


export const getSession = async (req, res) => {
    console.log('Get Session')
    try {
        const username = req.query.username

        //GET SESSIONS
        let newSessions = []
        
        let sessions = await sessionModel.find(
            {author: username, hide: false},  
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const ss of sessions) {
            let newExercises = [] 

            for (const ex of ss.exercises) {

                const mongExercise = await exerciseModel.findOne(
                    {_id: ex._id},
                    {author: 0, type: 0, fiber: 0}
                )

                newExercises.push({...mongExercise._doc})
            }

            newSessions = [...newSessions, {
                ...ss._doc,
                exercises: newExercises
            }]
        }
        
        res.json({
            message: newSessions,
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

export const patchSession = async (req, res) => {
    console.log('Patch Session')
    console.log(req.body)
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

        //UPDATE SESSION
        await sessionModel.findOneAndUpdate({_id: data._id},{
            ...data,
        })

         //GET SESSIONS
         let newSessions = []
        
         let sessions = await sessionModel.find(
             {author: username, hide: false},  
             {createAt: 0, updateAt: 0, __v: 0
         })
         
         for (const ss of sessions) {
             let newExercises = [] 
 
             for (const ex of ss.exercises) {
 
                 const mongExercise = await exerciseModel.findOne(
                     {_id: ex._id},
                     {author: 0, type: 0, fiber: 0}
                 )
 
                 newExercises.push({...mongExercise._doc})
             }
 
             newSessions = [...newSessions, {
                 ...ss._doc,
                 exercises: newExercises
             }]
         }
         
         res.json({
             message: newSessions,
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

export const deleteSession = async (req, res) => {
    console.log('Delete Session')
    const id = req.params.id
    const username = req.query.username
    
    try {

        //DELETE
        await sessionModel.findOneAndUpdate({_id: id}, {
            hide: true,
        })

        //GET SESSIONS
        let newSessions = []
        
        let sessions = await sessionModel.find(
            {author: username, hide: false},  
            {createAt: 0, updateAt: 0, __v: 0
        })
        
        for (const ss of sessions) {
            let newExercises = [] 

            for (const ex of ss.exercises) {

                const mongExercise = await exerciseModel.findOne(
                    {_id: ex._id},
                    {author: 0, type: 0, fiber: 0}
                )

                newExercises.push({...mongExercise._doc})
            }

            newSessions = [...newSessions, {
                ...ss._doc,
                exercises: newExercises
            }]
        }
        
        res.json({
            message: newSessions,
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
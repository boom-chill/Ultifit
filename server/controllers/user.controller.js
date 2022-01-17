import { userModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import * as fs from 'fs';
import { TDEECal } from './../utils/calculator.js';
import { v4 as uuidv4 } from 'uuid'

export const patchUser = async (req, res) => {
    console.log('Patch User')
    try {
        let data = req.body.data

        const username = req.params.id
        const newAvaImg = req.body.newAvatar

        const avaId = uuidv4()
        
        if( newAvaImg ) {
            const binaryData = new Buffer(newAvaImg, 'base64')

            fs.writeFileSync(`public/users/${username}-${avaId}-ava.jpeg`, binaryData, "binary", function(err) {
                console.log(err);
            });

            data = {
                ...data,
                avatar: `file/users/${username}-${avaId}-ava.jpeg`
            }
        }

        const TDEE = TDEECal({
            height: data.height,
            weight: data.weight,
            DOB: data.DOB,
            gender: data.gender,
            activityLevel: data.activityLevel,
        })

        data = {
            ...data,
            TDEE: TDEE,
        }

        await userModel.findOneAndUpdate({username: username}, {
            ...data
        })

        const existUser = await userModel.findOne({username: username}, {_id: 0, createdAt: 0, password: 0, __v:0})

        res.json({
            message: {
                data: existUser,
            },
            error: false,
        })

    } catch (error) {
        console.log(error)
            res.json({
                message: error,
                error: true,
            })
    }
}

export const postPremium = async (req, res) => {
    console.log('Post Premium User')
    try {
        const premium = req.body.premium

        const username = req.params.id

        const user = await userModel.findOne({username: username}, {_id: 0, password: 0, __v:0})

        const code = new Date(user.createdAt).valueOf()
        console.log('premium code of', username, code, Number(premium))

        let rightCode = false

        if(code == Number(premium) ) {
            await userModel.findOneAndUpdate({username: username}, {
                premium: true
            })
            rightCode = true
        }

        // await userModel.findOneAndUpdate({username: username}, {
        //     ...data
        // })

        const existUser = await userModel.findOne({username: username}, {_id: 0, createdAt: 0, password: 0, __v:0})

        res.json({
            message: {
                data: existUser,
                isActive: rightCode,
            },
            error: false,
        })

    } catch (error) {
        console.log(error)
            res.json({
                message: error,
                error: true,
            })
    }
}

export const postChangePassword =  async (req, res) => {
    console.log('Post Change Password')
    try {
        const username = req.params.id
        const data = req.body

        const password = data.currentPassword
        const newPassword = data.changeNewPassword

        let existUser = await userModel.findOne({username: username}, {_id: 0, createdAt: 0})

        //check password
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password)
        
        if(isPasswordCorrect) {
             //create password
            const passwordHashed = await bcrypt.hash(newPassword, 12)

            await userModel.findOneAndUpdate({username: username}, {password: passwordHashed })

            res.json({
                message: 'Password changed!',
                isChange: true,
                error: false,
            })

        } else {
            res.json({
                message: 'Wrong password!',
                isChange: false,
                error: true, 
            })
        }

     } catch (error) {
        console.log(error)
            res.json({
                message: error,
                isChange: false,
                error: true,
            })
    }
}
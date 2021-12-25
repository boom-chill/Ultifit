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
                error: false,
            })
    }
}
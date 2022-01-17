import { userModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import * as fs from 'fs';
import { TDEECal } from './../utils/calculator.js';
import { foodIngredientModel } from '../models/foodIngredientModel.js';
import { foodModel } from '../models/foodModel.js';

const expAccessTime = '5s' //1h

dotenv.config()

function objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
    return target;
  }

export const postLogin = async (req, res) => {
    console.log(req.body)
    try {
        const { username, password } = req.body
 
        let existUser = await userModel.findOne({username: username}, {_id: 0, createdAt: 0})
        
        if(!existUser) {
            return res.json( {
                message: 'Couldn\'t find your Account',
                error: true, 
            })
        }
        
        //check password
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password)
        
        if(isPasswordCorrect) {
            //const user = await objectWithoutProperties(existUser, ['password', 'username'])
            delete existUser.password

            const accessToken = jwt.sign({
                username: existUser.username,
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: expAccessTime,
            })
    
            res.json({
                message: {
                    accessToken: accessToken,
                    data: existUser,
                },
                error: false,
            })
        } else {
            res.json({
                 message: 'Wrong password',
                 error: true, 
                 })
        }
        
    } catch (error) {
        console.log(error)
        res.json({
            message: err, 
            error: true,
         })
    }
}

export const postRegister = async (req, res) => {
    console.log('post Register')
    try {
        const { username, password } = req.body
 
        const existUser = await userModel.findOne({username: username})
        
        if(existUser) {
            return res.json( {
                message: 'That username is taken',
                error: true, 
            })
        }
        
        //create password
        const passwordHashed = await bcrypt.hash(password, 12)

        //add user into db
        const newUser = new userModel({
            username: username,
            password: passwordHashed,
        })

        await newUser.save()

        const accessToken = jwt.sign({
            username: username,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: expAccessTime,
        })

        res.json({
            message: {
                accessToken: accessToken,
                data: {
                    username: username,
                },
            },
            error: false,
        })

        
    } catch (error) {
        console.log(error)
        res.json({
            message: err, 
            error: true,
         })
    }
}

export const postRegisterInfo = async (req, res) => {
    console.log('post RegisterInfo')
    try {
        let registerData = req.body

        const username = registerData.username
        const avaImg = registerData.avatar
        
        if( avaImg ) {
            const binaryData = new Buffer(avaImg, 'base64')

            fs.writeFileSync(`public/users/${username}-ava.jpeg`, binaryData, "binary", function(err) {
                console.log(err); // writes out file without error, but it's not a valid image
            });

            registerData = {
                ...registerData,
                avatar: `file/users/${username}-ava.jpeg`
            }
        }

        const TDEE = TDEECal({
            height: registerData.height,
            weight: registerData.weight,
            DOB: registerData.DOB,
            gender: registerData.gender,
            activityLevel: registerData.activityLevel,
        })

        registerData = {
            ...registerData,
            TDEE: TDEE,
        }

        await userModel.findOneAndUpdate({username: username}, {
            ...registerData
        })

        const existUser = await userModel.findOne({username: username}, {_id: 0, createdAt: 0, password: 0, __v:0})

         const accessToken = jwt.sign({
            username: existUser.username,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: expAccessTime,
        })

        res.json({
            message: {
                accessToken: accessToken,
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
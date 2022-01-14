import mongoose from 'mongoose'
const { Schema } = mongoose;

const HistoriesSchema = new Schema({

    _sessionID: { // cái này chứa ObjectId của FoodModel để link qua
        type: mongoose.Types.ObjectId,
        ref: 'sessions',
        required: false,
    },
    
    _foodID: {  // cái này chứa ObjectId của FoodModel để link qua
        type: mongoose.Types.ObjectId,
        ref: 'foods',
        required: false,
    },

    water: {
        _id: false,
        quantity: {
            required: false,
            type: Number, // tính theo số lần uống
        },
        mass: {
            required: false,
            type: Number, // tính theo ml
        },
        required: false,
    },

    name: {
        required: true,
        type: String
    },

    calories: {
        required: true,
        type: Number,
        default: 0,
    },

    protein: {
        required: false,
        type: Number,
    },

    fat: {
        required: false,
        type: Number,
    },

    carb: {
        required: false,
        type: Number,
    },

    totalTime: {
        required: false,
        type: Number
    },

    time: {type: Date, default: Date.now()},
    
    author: {// để phân biệt ai là người ghi
        type: String,
        required: true,
        default: 'anonymous' // username, admin
    },
    
    type: {// để phân loại histories: food, session, water
        type: String,
        required: true,
    },

    //auto add createdAt, updatedAt
}, {timestamps: true})

export const historiesModel = mongoose.model('Histories', HistoriesSchema)
import mongoose from 'mongoose'
const { Schema } = mongoose;

const FoodSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    ingredients: [
        {
            _ingerdientID: { // cái này chứa ObjectId của foodIngredientModel để link qua
                type: Schema.ObjectId,
                ref: 'FoodIngredients',
                required: true,
            },
            mass: {// tính theo gram
                type: Number,
                required: true,
            },
        }
    ],
    carb: { // được từ thành phần
        type: Number,
        required: true,
        default: 0,
    },
    protein: { // được từ thành phần
        type: Number,
        required: true,
        default: 0,
    },
    fat: { // được từ thành phần
        type: Number,
        required: true,
        default: 0,
    },
    calory: { // được từ thành phần
        type: Number,
        required: true,
    },
    author: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự add thêm
        type: String,
        required: true,
        default: 'anonymous' // username, admin
    },
    type: {// để phân loại nếu có chức năng liên quan
        type: String,
        required: false,
    },
    
 
    //auto add createdAt, updatedAt
}, {timestamps: true})

export const productModel = mongoose.model('Foods', FoodSchema)
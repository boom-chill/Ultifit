import mongoose from 'mongoose'
const { Schema } = mongoose;

const FoodSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    ingredients: [
        {
            _id: { // cái này chứa ObjectId của foodIngredientModel để link qua
                type: Schema.ObjectId,
                ref: 'foodigredients',
                required: true,
            },
            mass: {// tính theo gram
                type: Number,
                required: true,
            },
        }
    ],
    thumbnail: { // được từ thành phần
        type: String,
        required: false,
        default: 0,
    },
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
    calories: { // được từ thành phần
        type: Number,
        required: true,
        default: 0,
    },
    description: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự add thêm
        type: String,
        required: false,
    },
    author: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự add thêm
        type: String,
        required: true,
        default: 'anonymous' // username, admin
    },
    hide: {
        type: Boolean,
        required: true,
        default: false,
    },
    type: {// để phân loại nếu có chức năng liên quan
        type: String,
        required: false,
    },
    
 
    //auto add createdAt, updatedAt
}, {timestamps: true})

export const foodModel = mongoose.model('Foods', FoodSchema)
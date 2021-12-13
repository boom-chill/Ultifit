import mongoose from 'mongoose'
const { Schema } = mongoose;

const FoodIngredientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    carb: {
        type: Number,
        required: true,
        default: 0,
    },
    protein: {
        type: Number,
        required: true,
        default: 0,
    },
    fat: {
        type: Number,
        required: true,
        default: 0,
    },
    calories: {// calories trên mỗi gram
        type: Number,
        required: true,
        default: 0,
    },
    author: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự thêm thành phần
        type: String,
        required: true,
        default: 'anonymous' // username, admin
    },
    thumbnail: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự thêm thành phần
        type: String,
        required: false,
        default: null // username, admin
    },
    type: {// để phân loại nếu có chức năng liên quan
        type: String,
        required: false,
    },

    //auto add createdAt, updatedAt
}, {timestamps: true})

export const foodIngredientModel = mongoose.model('FoodIngredients', FoodIngredientSchema)
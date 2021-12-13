import mongoose from 'mongoose'
const { Schema } = mongoose;

const SessionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    exercises: [ // chứa chuỗi bài tập người dùng đã set up trước đó
        { // cái này chứa ObjectId của exerciseModel để link qua
            _id: false,
            _exerciseID: {
                type: Schema.ObjectId,
                ref: 'Exercises',
                required: true,
            },
            practiceTime: { // thờI gian tập
                type: Number, 
                required: true,
                default: 45,
            },
            restTime: {
                type: Number,
                required: true,
                default: 15,
            },
        },
    ],
    caloriesBurn: { // tổng số calo của 1 buổi tập
        type: Number,
        required: true,
    },
    author: {// để phân biệt nếu sau này có thêm chức năng ng dùng tự thêm bài tập
        type: String,
        required: true,
        default: 'anonymous' // username, admin
    }

    //auto add createdAt, updatedAt
}, {timestamps: true})

export const productModel = mongoose.model('Sessions', SessionSchema)
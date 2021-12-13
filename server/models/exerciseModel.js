import mongoose from 'mongoose'
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {// 3 loại: beginer, intermediate, hard
        type: String,
        required: true,
    },
    thumbnail: { // 1 tấm ảnh trong video, hình phải mô tả tư thế của bài tập
        type: String,
        required: true,
        default: null,
    },
    video: {// link chứa video
        type: String,
        required: true,
    },
    MET: { // số calo tiêu hao trong 1s của bài tập
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

export const exerciseModel = mongoose.model('Exercises', ExerciseSchema)
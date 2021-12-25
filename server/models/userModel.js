import mongoose from 'mongoose'
const { Schema } = mongoose;

const UserSchema = new Schema({
    //THÔNG TIN CHUNG
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: 'file/users/empty-avatar.jpg'
    },
    name: {
        type: String,
        required: false,
    },
    DOB: {
        type: Date,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    activityLevel: { // thể trạng, có 3 loại: skinny, fat, muscular
        type: Number,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    TDEE: {
        type: Number,
        required: false,
    },
    // TDEE sẽ tự tính trên client

    //auto add createdAt, updatedAt
}, {timestamps: true})

export const userModel = mongoose.model('Users', UserSchema)
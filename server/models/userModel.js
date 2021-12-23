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
    // TDEE và BMR sẽ tự tính trên client
    
    // NGƯỜI DÙNG TẠO
    sessions: [ // chứa khung bài tập người dùng đã set up trước đó
        {
            _id: false,
            required: false,
            _sessionID: { // cái này chứa ObjectId của sessionModel để link qua
                    type: mongoose.Types.ObjectId,
                    ref: 'Sessions',
                    required: true,
            },
            appointment: { // thờI gian hẹn tập, maybe dành cho setup từng ngày
                type: Date, 
                required: false,
            }
        },
    ],
    foods: [
        {
            _id: false,
            required: false,
            _foodID: { // cái này chứa ObjectId của foodModel để link qua
                type: mongoose.Types.ObjectId,
                ref: 'Foods',
                required: true,
            },
        }
    ],

    // LỊCH SỬ
    histories: 
        {
            _id: false,
            required: false,
            practiced: [
                {
                    _id: false,
                    required: false,
                    exercises: [ // chứa chuỗi bài tập người dùng đã tập
                        {
                            _id: { // cái này chứa ObjectId của exerciseModel để link qua
                                type: mongoose.Types.ObjectId,
                                ref: 'exercises',
                                rrequired: true,
                            },
                            practiceTime: { // thờI gian tập
                                type: Number, 
                                required: true,
                            },
                            restTime: { // thờI gian nghỉ
                                type: Number,
                                required: true,
                            },
                            required: false,
                        }
                    ],
                    calories:{// được tính trên client, dùng để hiển thị chi tiết
                        type: Number,
                        required: true,
                    },
                    time: {type: Date, default: Date.now()}, // ghi nhận lại ngày tập, lúc bắt đầu
                }
            ],
            eaten: [
                {
                    _id: { // cái này chứa ObjectId của FoodModel để link qua
                        type: mongoose.Types.ObjectId,
                        ref: 'foods',
                        required: true,
                    },
                    time: {type: Date, default: Date.now()},
                    required: false,
                }
            ],
            drank: [
                {
                    _id: false,
                    required: false,
                    quantity: {
                        required: true,
                        type: Number, // tính theo số lần uống
                    },
                    mass: {
                        required: true,
                        type: Number, // tính theo ml
                    },
                    time: {
                        type: Date,
                        required: true,
                    } 
                }
            ]
        },
       


    //auto add createdAt, updatedAt
}, {timestamps: true})

export const userModel = mongoose.model('Users', UserSchema)
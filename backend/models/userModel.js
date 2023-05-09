const mongoose =  require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    tmpEmail:{
        type:String,
        default:''
    },
    tmpEmailIsVerify:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    isVerify:{
        type:Boolean,
        default:false
    }
},
{
    timestamps: true,
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
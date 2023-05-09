const mongoose =  require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    token:{
        type:String,
        required:true
    }
},
{
    timestamps: true,
  }
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
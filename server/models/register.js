import mongoose from 'mongoose';


const RegisterSchema = new mongoose.Schema ({
  name:{type: String, required: true},
  username: {type: String, required: true , unique:true},
  password: {type: String, required: true},
  wallet: {
    type: Number,
    default: 0
  }  
})

const Register = mongoose.model("Register", RegisterSchema);

export default Register;
import mongoose from 'mongoose';
import { BiCategory } from 'react-icons/bi';

const RegisterSchema = new mongoose.Schema ({
  name:{type: String, required: true},
  username: {type: String, required: true , unique:true},
  password: {type: String, required: true},
  
})

const Register = mongoose.model("Register", RegisterSchema);

export default Register;
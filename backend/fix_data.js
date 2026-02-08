
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


const userSchema = new mongoose.Schema({
    email: String,
    role: String
}, { strict: false });

const productSchema = new mongoose.Schema({
    name: String,
    costPrice: Number,
    salesPrice: Number
}, { strict: false });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

const fixData = async () => {
    await connectDB();

    try {

        const email = 'vanshsharma020406@gmail.com';
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { role: 'MANAGER' } },
            { new: true }
        );

        if (user) {
            console.log(`✅ User ${user.email} is now: ${user.role}`);
        } else {
            console.log(`❌ User ${email} NOT FOUND`);
        }


        const res = await Product.updateMany(
            {},
            { $set: { costPrice: 500, salesPrice: 800 } }
        );
        console.log(`✅ Updated ${res.modifiedCount} products with prices (Cost: 500, Sales: 800)`);

        process.exit(0);
    } catch (error) {
        console.error('Error updating data:', error);
        process.exit(1);
    }
};

fixData();

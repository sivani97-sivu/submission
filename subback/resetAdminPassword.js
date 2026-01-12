/*const mongoose = require('mongoose');
const { hashPassword } = require('./hashAdminPassword');

mongoose.connect('mongodb://127.0.0.1:27017/YOUR_DB_NAME', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const adminSchema = new mongoose.Schema({
    email: String,
    password: String
});

const Admin = mongoose.model('Admin', adminSchema);

(async () => {
    const newPassword = 'Admin123'; // your new password
    const hashed = await hashPassword(newPassword);

    await Admin.updateOne({ email: 'admin1@gmail.com' }, { password: hashed });
    console.log('Admin password reset!');
    mongoose.disconnect();
})();*/
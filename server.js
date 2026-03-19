require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // THÊM DÒNG NÀY

const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Phục vụ file tĩnh
app.use(express.static(path.join(__dirname, 'web'))); 
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/terms', express.static(path.join(__dirname, 'terms_and_conditions')));

// Trang chủ
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'web', 'index.html'));
// });
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'web', 'index.html');
    // Kiểm tra xem server có tìm thấy file không, nếu không thì hiện chữ thay thế
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(200).send("Server CookEasy đã chạy, nhưng không tìm thấy file index.html trong thư mục web!");
        }
    });
});

// API routes
app.use('/api', recipeRoutes);
app.use('/api', favoriteRoutes);
app.use('/api/users', userRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI) // Bỏ các option cũ vì Mongoose 6+ tự có rồi
.then(() => console.log('✅ Đã kết nối MongoDB Atlas'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Server chạy
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = app;

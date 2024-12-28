const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');  // 用户认证路由
const postRoutes = require('./routes/posts'); // 帖子相关路由

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());  // 解析 JSON 格式的请求体

// 提供静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接
mongoose.connect('mongodb://127.0.0.1/forum', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("数据库连接成功"))
    .catch(err => console.log("数据库连接失败", err));

// 路由配置
app.use('/api/auth', authRoutes);  // 用户认证相关路由
app.use('/api/posts', postRoutes); // 帖子相关路由

// 默认路由，返回静态的 `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // 返回首页
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://127.0.0.1:${PORT}`);
});

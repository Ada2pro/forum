const mongoose = require('mongoose');

// 尝试连接到 MongoDB 本地数据库
mongoose.connect('mongodb://127.0.0.1:27017/forum', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    reconnectTries: 30,          // 重连次数
    reconnectInterval: 500,      // 重连间隔
    socketTimeoutMS: 45000,      // Socket 超时
    connectTimeoutMS: 10000,     // 连接超时
});

// 连接成功事件
mongoose.connection.on('connected', () => {
    console.log('MongoDB 连接成功');
});

// 连接错误事件
mongoose.connection.on('error', (err) => {
    console.error('MongoDB 连接错误:', err);
});

// 连接断开事件
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB 连接断开');
});

// 程序退出时，关闭数据库连接
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB 连接已关闭');
    process.exit(0);
});

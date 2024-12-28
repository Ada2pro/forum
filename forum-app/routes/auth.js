const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // 引入用户模型

const router = express.Router();

// 注册 API
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // 检查是否有空字段
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: '所有字段都是必填的' });
    }

    // 检查用户是否已经存在
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: '该电子邮件已被注册' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 创建新用户
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 保存用户到数据库
        await newUser.save();

        // 创建并返回 JWT
        const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.status(201).json({ success: true, message: '注册成功', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 登录 API (可选，如果后续需要)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 检查是否有空字段
    if (!email || !password) {
        return res.status(400).json({ success: false, message: '所有字段都是必填的' });
    }

    try {
        // 查找用户
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: '用户不存在' });
        }

        // 检查密码是否匹配
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: '密码错误' });
        }

        // 创建并返回 JWT
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.status(200).json({ success: true, message: '登录成功', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

module.exports = router;

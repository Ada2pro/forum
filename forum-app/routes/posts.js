const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// 创建新帖子
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers['authorization'];

    if (!token) return res.status(403).send('未授权');

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(404).send('用户未找到');

        const newPost = new Post({ title, content, author: user._id });
        await newPost.save();
        res.status(201).send('帖子创建成功');
    } catch (err) {
        res.status(500).send('服务器错误');
    }
});

// 获取所有帖子
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).send('服务器错误');
    }
});

module.exports = router;

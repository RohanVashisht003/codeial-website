const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');
const postsMailer = require('../mailers/posts_mailer');
const postEmailWorker = require('../workers/post_email_worker');
const queue = require('../config/kue');


module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        post = await post.populate('user','name _id email avatar');

        let job = queue.create('post_email',{
            post:post,
        }).save(function(err){
            if(err){
                console.log(err, 'error in creating queue');
                return;
            }
            console.log('job enqueued',job.id);
        })

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post: post
                    },
                    message: "Post created"
                });
            }
        
} catch(err){
    req.flash('error', err);
    console.log(err);
    return res.redirect('back');
}
}

module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id);
             console.log("user",post.user);
             
        if (post.user == req.user.id) {
            
            // delete all associated likes and comment for the post

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await Comment.deleteMany({
                post: req.params.id
            });
            post.remove();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', "Post and comments deleted");
            return res.redirect('back');

        } else {
            req.flash('error', "You are not authorized ,cannot delete this post");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("error", err);
        return res.redirect('back');
    }
}
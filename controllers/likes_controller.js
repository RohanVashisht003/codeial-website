const Comment= require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/likes');

module.exports.toggleLike = async function(req, res){
    try{

        // url=>  likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        // find likeable object and its id
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
            console.log(likeable.likes)
        }
        else{
            likeable= await Comment.findById(req.query.id).populate('likes');
        }

        // check if like is already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // iflike exists then delete it
        if(existingLike){
            // //////////////////changed id to _id/////////
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }
        else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.status(200).json( 
            {
                message: "Liked successfull",
                data:{
                    deleted:deleted
                }
            })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
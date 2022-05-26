const nodeMailer = require('../config/nodemailer');


exports.newPost = (post, comment) =>{
    console.log('inside new post mailer', post);

    let htmlString = nodeMailer.renderTemplate({post:post, comment:comment}, '/post/new_post.js');

    nodeMailer.transporter.sendMail({
        from:'sharmashubham2961@gmail.com',
        to: post.user.email,
        subject: `New Post Published on ${post.user.name}'s post publiched!`,
        html: htmlString
    },(err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log("Mail delivered", info);
        return;
    })
}
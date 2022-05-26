const nodeMailer = require('../config/nodemailer');


exports.newPost = (post) =>{
    console.log('inside new post mailer', post);

    let htmlString = nodeMailer.renderTemplate({post:post}, '/posts/new_post.ejs');

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
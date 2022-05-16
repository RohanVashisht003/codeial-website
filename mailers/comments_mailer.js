const nodeMailer = require('../config/nodemailer');

// this is another way of exporting method
exports.newComment = (comment,post) => {
    console.log('inside new comment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment:comment, post:post}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail(
        {
           from:'sharmashubham2961@gmail.com',
           to:comment.user.email,
           subject: `New Comment on ${post.user.name}'s post published!`,
           html: htmlString, 
        },(err, info)=>{
            if(err){
                console.log("Error in sending mail", err);
                return;
            }
            console.log("Mail delivered", info);
            return;
        });
};
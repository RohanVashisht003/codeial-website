const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');



// implemented morgan for logs
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path: logDirectory
})


const development = {
    name:'development',
    codeial_main_port:8000,
    asset_path: './assets',
    session_cookie_key:"blabla",
    db: 'codeial_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sharmashubham2961@gmail.com',
            pass: 'uoamfdtnjxtkxyrx'
        }
    },
    google_client_id:"550300148344-d83qjf3crf214nkn8omdo53mtcgqvs9h.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name:'production',
    codeial_main_port:process.env.CODEIAL_MAIN_PORT,
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_SMTP_USER,
            pass: process.env.CODEIAL_SMTP_PASSWORD
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_key: process.env.CODEIAL_JWT_KEY,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);


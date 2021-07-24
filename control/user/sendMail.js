const nodemailer = require('nodemailer')
const {google} = require('googleapis')


const CLIENT_ID='441550001644-9qv5e6d6nttu9t128tf3vq9ujucncprg.apps.googleusercontent.com';
const CLIENT_SECRET='4_j2C8A-6mjglGzIoHNdNfic';
const REDIRECT_URI='https://developers.google.com/oauthplayground ';
const REFRESH_TOKEN='1//04dRb0VQkWJgJCgYIARAAGAQSNwF-L9IrxNMdf0oHAvhlERkk-eHevsiFqhxFCxnsm4Sff5UatSLEchDT_IkwsbYgRIpnEalxlEg';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});


async function sendMail(){
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'ecommercemusical@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = { 
            from: 'Musical Ecommerce <ecommercemusical@gmail.com>',
            to: 'rodrigoignacio932@gmail.com',//req.body.email,
            subject: "prueba",
            text: 'ezequiel aguilera la tenes adentro',
            html: '<h1>ezequiel aguilera la tenes adentro</h1>',
        }

        const result = await transport.sendMail(mailOptions)
        return result

    

    }catch(error){
        return error; 
    }
}

// sendMail()
//     .then((result) => console.log('Email sent...', result))
//     .catch((error)=> console.log(error.message))

/* const sendMail = (req, res, next) => {

     
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'adriana.king@ethereal.email',
            pass: 'rpYd7Pv5SFxy41dMau'
        }
    });

    const {type} = req.query

    if(type === 'welcome'){
        let templateHtml = `
        <h1 style="color: red">Te damos la bienvenida ${req.body.name}</h1>
        <p>Gracias por registrarte con nosotros. <br>
        Esperamos que podamos ayudarte a encontrar el intrumento de tus sueños <br>    
        </p>
        `
     
        var mailOptions = {
            from: "Ecommerce",
            to: req.body.email,
            subject: "Mail de prueba",
            html: templateHtml
        }
    
        transporter.sendMail(mailOptions, (err) => {
            if(err) next(err)
            else{
                console.log('Envío exitoso')
                 res.send(mailOptions)
            }
        })

    }




} */

module.exports = {
    sendMail
}
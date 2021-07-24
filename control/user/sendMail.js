const nodemailer = require('nodemailer')
const {google} = require('googleapis')


const CLIENT_ID='441550001644-9qv5e6d6nttu9t128tf3vq9ujucncprg.apps.googleusercontent.com';
const CLIENT_SECRET='4_j2C8A-6mjglGzIoHNdNfic';
const REDIRECT_URI='https://developers.google.com/oauthplayground ';
const REFRESH_TOKEN='1//04dRb0VQkWJgJCgYIARAAGAQSNwF-L9IrxNMdf0oHAvhlERkk-eHevsiFqhxFCxnsm4Sff5UatSLEchDT_IkwsbYgRIpnEalxlEg';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});


const sendMail = async (req, res, next) => {
    const {type} = req.query
    const { name, email } = req.body    
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
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

        switch (type){
            case 'welcome':               
                    const templateHTML = `
                    <div style="justify-content: center">
                        <h3>Hola ${name}, te damos la bienvenida a Musical Instrument</h3>
                        <p> Gracias por registrarte en nuestro sitio! <br>
                        Deseamos que puedas encontrar el instrumento de tus sueños. </p>
                    </div>
                    `        
                    const mailOptions = { 
                        from: 'Musical Ecommerce <ecommercemusical@gmail.com>',
                        to: email,//req.body.email,
                        subject: "Gracias por registrarte a Musical Ecommerce",
                        html: templateHTML,
                    }    
                    await transporter.sendMail(mailOptions, (err) => {
                        if(err) next(err)
                        else{
                            console.log('Envío exitoso')
                            return res.send(mailOptions)
                        }
                    })
                       
            }
    }catch(error){ next(error) }

                
}



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
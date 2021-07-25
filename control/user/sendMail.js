const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { User, Order } = require('../../db.js');


const CLIENT_ID = '441550001644-9qv5e6d6nttu9t128tf3vq9ujucncprg.apps.googleusercontent.com';
const CLIENT_SECRET = '4_j2C8A-6mjglGzIoHNdNfic';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground ';
const REFRESH_TOKEN = '1//04dRb0VQkWJgJCgYIARAAGAQSNwF-L9IrxNMdf0oHAvhlERkk-eHevsiFqhxFCxnsm4Sff5UatSLEchDT_IkwsbYgRIpnEalxlEg';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const sendMail = async (req, res, next) => {
    const { type } = req.query;
    try {
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

        switch (type) {
            case 'welcome':
                const { name, email } = req.headers;
                const templateHTML_welcome = `
                    <div style="justify-content: center">
                        <h3>Hola ${name}, te damos la bienvenida a Musical Instrument</h3>
                        <p> Gracias por registrarte en nuestro sitio! <br>
                        Deseamos que puedas encontrar el instrumento de tus sueños. </p>
                    </div>
                    `
                const mailOptions_welcome = {
                    from: 'Musical Ecommerce <ecommercemusical@gmail.com>',
                    to: email,//req.body.email,
                    subject: "Gracias por registrarte a Musical Ecommerce",
                    html: templateHTML_welcome,
                }
                return await transporter.sendMail(mailOptions_welcome, (err) => {
                    if (err) next(err)
                    else {
                        console.log('Envío exitoso');
                        return res.send(mailOptions_welcome);
                    }
                })
            case 'approved':
                const user_approved = await User.findOne({
                    where: {
                        id: req.query.idUser,
                        
                    }
                });

                const order_approved = await Order.findOne({
                    where: {
                        UserId: req.query.idUser
                    }
                })
                order_approved.status = type
                await order_approved.save()
                const name_approved = user_approved.dataValues.userName.split(' ')
                const templateHTML_approved = `
                    <div style="justify-content: center">
                        <h3>Hola ${name_approved[0]}, tu compra en Musical Instrument fue realizada con exito!</h3>
                        <p> El envio ser realizará dentro de los primeros 10 días hábiles de 9:00 a 18:00 hs. <br>
                        Al momento de despacharse tu producto recibirá un correo informandole el envío.<br>
                        Ante cualquier duda, no dude en escribirnos.</p>
                    </div>
                    `
                const mailOptions_approved = {
                    from: 'Musical Ecommerce <ecommercemusical@gmail.com>',
                    to: user_approved.dataValues.email,
                    subject: "Gracias por tu compra!",
                    html: templateHTML_approved,
                }
                return await transporter.sendMail(mailOptions_approved, (err) => {
                    if (err) next(err)
                    else {
                        return res.send(mailOptions_approved);
                    }
                })
            case 'rejected':
                const user_rejected = await User.findOne({
                    where: {
                        id: req.query.idUser
                    }
                });

                const order_rejected = await Order.findOne({
                    where: {
                        UserId: req.query.idUser
                    }
                })
                order_rejected.status = type
                await order_rejected.save()

                const name_rejected = user_rejected.dataValues.userName.split(' ')
                const templateHTML_rejected = `
                    <div style="justify-content: center">
                        <h1>Hola ${name_rejected[0]}, lamentablemente tu compra en Musical Instrument fue rechazada.</h1>
                        <h3> Ningún monto fue descontado de su cuenta. <br>
                        Ante cualquier duda, no dude en escribirnos.<br>
                        En caso de no estar suscripto a nuestro Newsletter<br>
                        Este es un mail automático, no es necesario responderlo.</h3>
                    </div>
                    `
                const mailOptions_rejected = {
                    from: 'Musical Ecommerce <ecommercemusical@gmail.com>',
                    to: user_rejected.dataValues.email,
                    subject: "Hubo un problema con tu pago",
                    html: templateHTML_rejected,
                }
                return await transporter.sendMail(mailOptions_rejected, (err) => {
                    if (err) next(err)
                    else {
                        return res.send(mailOptions_rejected);
                    }
                })
            default:
                return console.log('JEJEJEJEJE')
        }
    } catch (error) { 
        next(error) 
    }
};



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
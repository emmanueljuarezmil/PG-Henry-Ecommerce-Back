const nodemailer = require('nodemailer')


const sendMail = (req, res, next) => {

    
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jaden83@ethereal.email',
            pass: 'tuRdwghz1WXV6aUvme'
        }
    });


    let templateHtml = `
    <h1 style="color: red">Hola ${req.body.name}</h1>
    <p>Te enviamos este mail de prueba</p>
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
             res.send(mailOptions)}
    })


}

module.exports = {
    sendMail
}
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')

var  app   = express(),
    Port   = 3000 || env.process.PORT;

// Contact us Form
// router.get( (req, res)=> {
//   const output = `
//   <p>You have a new contact Message</p>
//   <h3>Contact Details</h3>
//   <ul>
//     <li>Name: ${req.body.name}</li>
//     <li>Email: ${req.body.email}</li>
//   </ul>
//   <h3>Message: ${req.body.message}</h3>`;
//   console.log(output);

  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: './config/gmail/mail', // generated ethereal user
          pass: './config/gmail/pass' // generated ethereal password
      },
      tls:{
        rejectUnauthorized: false
      }
  });
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'o4afqpvpbkobwxuh@ethereal.email',
//         pass: 'zJHGmffwtxdyd2u26H'
//     },
//           tls:{
//             rejectUnauthorized: false
//           }
// });
  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer contact" <o4afqpvpbkobwxuh@ethereal.email>', // sender address
      to: 'test@gmail.com', // list of receivers
      subject: 'Contact Us request.', // Subject line
      text: 'Hello!', // plain text body
      html: "Again I am Sending this data" // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    //   req.flash("success", "Email has been Send. Thank you For contacting us");
    //   console.log();

  });
// });


app.listen(Port, (res, err)=> {
    if(err){
      console.log("Server Not Started", err);
      res.render('error')
    }console.log("Server has been Started i.e. " + Port);
  })
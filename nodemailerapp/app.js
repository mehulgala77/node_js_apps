
const path = require('path');
const express = require('express')
const { engine } = require('express-handlebars');
const nodeMailer = require('nodemailer');

const app = express();

// view engine setup
app.engine('handlebars', engine({
  defaultLayout: false,
}));
app.set('view engine', 'handlebars');

// body parser setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static folder path
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', async (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodeMailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    // tls: {
    //   // To allow localhost apps to send an email
    //   rejectUnauthorized: false,
    // }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"NodeMailer Contact" <foo@example.com>', // sender address
    to: 'mehulgala007@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  cople.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.render('contact', {
    msg: 'Email has been sent',
  });

});

app.listen(4000, () => console.log('App running on port 4000'));
const sgMail = require("@sendgrid/mail");
const sender = process.env.SENDER_EMAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    from: sender,
    to: email,
    subject: "Welcome in our App",
    html: `<h1 style="text-align: center; color: red">Hello, ${name} in Task App</h1> <p style="text-align:center; background-color: #111; color: #fff; font-size: 30px">We hope you like the App</p>`,
  });
};

const sendDeleteEmail = (email, name) => {
  sgMail.send({
    from: sender,
    to: email,
    subject: "Good bye!",
    html: `<div style="background-color: #333; padding: 50px; text-align: center"><h1 style="text-align: center; color: red">Goodbye, ${name} in Task App</h1> <p style="text-align:center; background-color: yellow; color: #333; font-size: 30px">We are sorry! you can make account again</p><img style="display: block; margin: auto" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2gSCIYnApep7rcCteItVhtOMOFZP4JideWg&usqp=CAU'> </div>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendDeleteEmail,
};
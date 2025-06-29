// services/emailService.js
// Stubbed email service – integrate with Nodemailer, SendGrid, etc.

const sendEmail = async ({ to, subject, text, html }) => {
    // For real usage, integrate with an email provider
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log('HTML:', html);
    
    // Example: await transporter.sendMail({...})
  };
  
  module.exports = {
    sendEmail
  };
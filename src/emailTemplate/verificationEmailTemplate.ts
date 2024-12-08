export const verificationEmailTemplate = (name:string, verificationCode:string) => {
    return `
         <!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Email Verification</title>
             <style>
                 body {
                     background-color: #fff;
                     color: #333;
                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                     margin: 0;
                     padding: 0;
                 }
                 .container {
                     padding: 20px;
                     margin: 0 auto;
                     background-color: #eee;
                     border-radius: 8px;
                     max-width: 600px;
                 }
                 h1 {
                     font-size: 24px;
                     margin-bottom: 15px;
                 }
                 p {
                     font-size: 16px;
                     line-height: 1.5;
                     margin: 16px 0;
                 }
        .image-section {
            background-color: #ddcced;
            padding: 20px 0;
            text-align: center;
        }
                 .verification-section {
                     text-align: center;
                     margin: 20px 0;
                 }
                 .code-text {
                     font-weight: bold;
                     font-size: 36px;
                     margin: 10px 0;
                 }
                 .footer-text {
                     font-size: 12px;
                     padding: 20px;
                     text-align: center;
                 }
             </style>
         </head>
         <body>
             <div class="container">
                 <div class="image-section">
                     <img src="https://res.cloudinary.com/drdgi9qdu/image/upload/v1727289698/SC7XrUHmR5CIgmQ-XWvE5Q-removebg-preview_rso636.png" width="400" height="200" alt="Whisper Logo" />
                 </div>
                 <h1>Verify your Email address</h1>
                 <p>Hello ${name},</p>
                 <p>
                     Thanks for starting the new SaveJobs account creation process. We want to make sure it's really you. 
                     Please enter the following verification code when prompted. If you don’t want to create an account, 
                     you can ignore this message.
                 </p>
                 <div class="verification-section">
                     <p class="verify-text">Verification code</p>
                     <p class="code-text">${verificationCode}</p>
                     <p>(This code is valid for 10 minutes)</p>
                 </div>
                 <p class="footer-text">This message was produced and distributed by Whisper.</p>
             </div>
         </body>
         </html>
         `
}
import nodemailer from 'nodemailer';
import {buildOrderEmail} from './orderEmailTemplate';

function transporter(){
 const user=process.env.EMAIL_USER,pass=process.env.EMAIL_APP_PASSWORD;
 return user&&pass?nodemailer.createTransport({service:'gmail',auth:{user,pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000}):null;
}

export async function sendOrderEmail(input){
 const order=Array.isArray(input)?input[0]:input,mail=transporter();
 if(!mail||!order?.customer_email)return {skipped:true};
 await mail.sendMail({from:`OUTLETX <${process.env.EMAIL_USER}>`,to:order.customer_email,...buildOrderEmail(input)});
 return {skipped:false};
}

export async function sendAdminNotification(input){
 const mail=transporter();
 if(!mail||!process.env.ADMIN_EMAIL)return {skipped:true};
 await mail.sendMail({from:`OUTLETX <${process.env.EMAIL_USER}>`,to:process.env.ADMIN_EMAIL,...buildOrderEmail(input,{admin:true})});
 return {skipped:false};
}

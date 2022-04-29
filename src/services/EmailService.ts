import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import {UserDTO} from "../models/DTO/User/UserDTO";
import AssetDTO from "../models/DTO/Asset/AssetDTO";

dotenv.config();
const { SENDGRID_API_KEY } = process.env;

export default class EmailService {
    constructor() {
        sgMail.setApiKey(SENDGRID_API_KEY)
    }

    public async SendWarningReport(user: UserDTO, asset: AssetDTO) {
       const email = {
           to: 'alan.alb.flopes@gmail.com',
           from: 'alan.alb.flopes@gmail.com',
           subject: `[Prevent-Machine] ATTENTION! Asset ${asset.id} is ${asset.status}`,
           html: `<h3>Attention, the asset ${asset.id} is ${asset.status}</h3>
                <h4>Asset data:</h4>
                <ul>
                <li>- name: ${asset.name};</li>
                <li>- id: ${asset.id};</li>
                <li>- model: ${asset.model};</li>
                <li>- unit: ${asset.owner.id};</li>
                <li>- unitName: ${asset.owner.name};</li>
                </ul>
                <el>With care, Prevent Machine 🩺🤖</el>`,
       };
       const response = await sgMail.send(email);
        console.log(response);
    }
}
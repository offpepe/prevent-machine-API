import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import {UserDTO} from "../models/DTO/User/UserDTO";
import AssetDTO from "../models/DTO/Asset/AssetDTO";
import TransporterSetup from "../models/DTO/Email/TransporterSetup";

dotenv.config();
const {GOOGLE_OAUTH2_ACCESS_KEY, SENDER_EMAIL, MAILER_SERVICE} = process.env;

export default class EmailService {
    private readonly transporter: TransporterSetup;
    private mailer;

    constructor() {
        this.transporter = new TransporterSetup(MAILER_SERVICE, SENDER_EMAIL, GOOGLE_OAUTH2_ACCESS_KEY);
        this.mailer = nodemailer.createTransport(this.transporter);
    }

    public async SendWarningReport(user: UserDTO, asset: AssetDTO) {
        const email = {
            to: user.email,
            from: SENDER_EMAIL,
            subject: `[Prevent-Machine] ATTENTION! Asset ${asset.id} is ${asset.status}`,
            html: `
                <div align="center">
                <img alt="asset image" src=${asset.image} width="300px" />
                <h3>Asset status: ${asset.status}</h3>
                </div>
                <h4>Asset data:</h4>
                <ul>
                <li> name: ${asset.name};</li>
                <li> id: ${asset.id};</li>
                <li> model: ${asset.model};</li>
                <li> unit: ${asset.owner.id};</li>
                <li> unitName: ${asset.owner.name};</li>
                </ul>
                <el>With care, Prevent Machine 🩺🤖</el>`,
        };
        await this.mailer.sendMail(email, (err, info) => err ? console.log(err) : console.log(`[server]: email sent -> ${info.response}`));
    }
}
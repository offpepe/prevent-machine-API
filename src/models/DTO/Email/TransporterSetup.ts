
export default class TransporterSetup {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
    constructor(service: string, user:string, pass:string) {
        this.service = service;
        this.auth = {
            user,
            pass,
        }
    }
}
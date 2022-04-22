
export default interface IRegisterUserRequest {
    name: string,
    lastName: string,
    email: string,
    password: string,
    companyId?: string,
}
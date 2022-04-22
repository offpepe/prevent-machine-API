
export interface IRegisterUserResponse {
    name: string,
    email: string,
    role: string,
}

export interface IRegisterUserRequest {
    name: string,
    lastName: string,
    email: string,
    password: string,
    companyId?: string,
}
export interface IUpdateUserRequest {
    name?: string,
    lastName?: string,
    email: string,
    role?: string,
    password?: string,
    companyId?: string,
}

export interface IUpdateUserResponse {
    name: string,
    lastName: string,
    email: string,
    role: string,
}
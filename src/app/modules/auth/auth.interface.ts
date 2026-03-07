export interface IUserChangePassword {
    newPassword : string
    currentPassword: string
}

export interface IEmailVerification {
    otp: string,
    email:string

}
export interface IRestPassword {
    otp: string,
    email:string
    resetPassword:string

}
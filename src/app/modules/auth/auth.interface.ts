export interface IUserChangePassword {
    newPassword : string
    currentPassword: string
}

export interface IEmailVerification {
    otp: string,
    email:string

}
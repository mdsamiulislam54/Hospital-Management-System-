
import { Gender } from "../../../generated/enums";

export interface ICreateDoctor {
    password: string;
    data: {
        userId:string;
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        registrationNumber: string;
        gender: Gender;
        experience?: number;
        qualification?: string;
        appointmentFee?: number;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialties: string[];


}
//    "specialties":["871eb953-e5b4-4e0a-af3a-d30e0efa8fc5","77caafd2-b915-48bc-8267-4a6a914b2abb"]

export  interface ICreateSuperAdmin {
    password:string,
    data:{
        userId:string
        name:string
        email:string
        profilePhoto?: string
        contactNumber?: string
        gender: Gender
    }
}
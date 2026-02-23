

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
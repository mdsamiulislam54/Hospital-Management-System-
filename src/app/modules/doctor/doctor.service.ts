import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
            contactNumber: true,
            registrationNumber: true,
            currentWorkingPlace: true,
            designation: true,
            experience: true,
            qualification: true,
            appointmentFee: true,

            gender: true,
            doctorSpecialties: {

                select:{
                    doctorId: true,
                    id: true,

                    specialty:{
                        select:{
                            id: true,
                            title: true,
                            icon: true,

                        }
                    }
                }
            },

            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    needPasswordChange: true,
                    status: true,
                    emailVerified: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                }
            },

            createdAt: true,
            updatedAt: true,
        }
    });
    return doctors;

}



export const doctorService = {
    getAllDoctors,
}
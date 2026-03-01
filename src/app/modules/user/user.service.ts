
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./Interface";
import { UserRole } from "../../../generated/enums";
import { Specialty } from "../../../generated/client";
import { AppError } from "../../middleware/AppError";
import status from "http-status";


const createDoctor = async (payload: ICreateDoctor) => {
    const specialties: Specialty[] = [];
    for (const specialtyId of payload.specialties) {
        const existingSpecialty = await prisma.specialty.findUnique({
            where: { id: specialtyId },
        });
        if (!existingSpecialty) {
            throw new AppError(status.EXPECTATION_FAILED,`Specialty with id ${specialtyId} does not exist`);
        }
        specialties.push(existingSpecialty);
    };

    const user = await prisma.user.findUnique({ where: { email: payload.data.email } });
    if (user) {
        throw new AppError(status.CONFLICT,"User with this email already exists");
    };


    const useData = await auth.api.signUpEmail({
        body: {
            name: payload.data.name,
            email: payload.data.email,
            password: payload.password,
            role: UserRole.DOCTOR,
            needPasswordChange: true

        }
    });

    if (!useData.user) {
        throw new AppError(status.BAD_REQUEST,"User creation failed");
    }



    try {
        const doctor = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userid: useData?.user?.id,
                    ...payload.data,
                }
            });

            const doctorSpecialtiesData = specialties.map((specialty) => ({
                doctorId: doctorData.id,
                specialtyId: specialty.id,
            }));

            await tx.doctorSpecialty.createMany({
                data: doctorSpecialtiesData,
            });
            const doctor = await tx.doctor.findUnique({
                where: { id: doctorData.id },
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
                        select: {
                            specialty: {
                                select: {
                                    id: true,
                                    title: true,

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
            })

            return doctor;
        })

        return doctor
    } catch (error) {
        console.error("Error creating doctor record:", error);
        await prisma.user.delete({ where: { id: useData.user.id } });
        throw new AppError(status.BAD_REQUEST,"Failed to create doctor record");

    }

}

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}





export const userService = {
    createDoctor,
    getAllUsers
}
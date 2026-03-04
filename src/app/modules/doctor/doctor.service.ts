import status from "http-status";
import { Doctor, Status } from "../../../generated/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            user: true,
            doctorSpecialties: true
        }
    });
    return doctors;

}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            user: true,
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            appointment: {
                include: {
                    patient: true,
                    prescription: true,
                    doctorschedule: true

                }
            },
            review: true,
            doctorSpecialties: true
        }
    });
    return doctor;
}

const doctorUpdateById = async (id: string, payload: Partial<IUpdateDoctorPayload>) => {
    console.log({DoctorId: id})
    const isDoctorExist = await prisma.doctor.findUnique({ where: { id } });

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    };

    const { doctor: doctorData, specialties } = payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
                },
                data: {
                    ...doctorData,
                }
            });

            if (specialties && specialties.length > 0) {
                for (const specialty of specialties) {
                    const { specialtyId, shouldDelete } = specialty;
                    if (shouldDelete) {
                        await tx.doctorSpecialty.delete({
                            where: {
                                doctorId_specialtyId: {
                                    specialtyId,
                                    doctorId: id
                                }
                            }
                        })
                    } else {
                        await tx.doctorSpecialty.upsert({
                            where: {
                                doctorId_specialtyId: {
                                    specialtyId:specialtyId,
                                    doctorId: id
                                }
                            },
                            create: {
                               specialtyId: specialtyId,
                                doctorId: id
                            },
                            update: {}
                        })
                    }
                }
            }
        }
    })

    const doctor = await getDoctorById(id)
    return doctor


}


const doctorDeleteById = async (id: string) => {
    const isDoctorExist = await prisma.doctor.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!isDoctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found");
    }

    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        await tx.user.update({
            where: { id: isDoctorExist.userid },
            data: {
                isDeleted: true,
                status: Status.BLOCKED

            }
        })
        await tx.session.deleteMany({
            where: { userId: isDoctorExist.userid }
        })

        await tx.doctorSpecialty.deleteMany({
            where: { doctorId: id }
        })
    })

    return { message: "Doctor deleted successfully" };
};
const doctorRestoreById = async (id: string) => {
    const restoredDoctor = await prisma.doctor.update({
        where: {
            id,
            isDeleted: true
        },
        data: {

            isDeleted: false,
            deletedAt: null
        },
        include: {
            user: {
                select: {
                    id: true,
                }
            },
            doctorSpecialties: {
                select: {
                    doctor: {
                        select: {
                            id: true,
                            isDeleted: true,
                            deletedAt: true,
                            name: true,
                        }
                    }
                }
            }

        }
    });

    if (!restoredDoctor.user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const restoredUser = await prisma.user.update({
        where: {
            id: restoredDoctor.user.id
        },
        data: {
            isDeleted: false,
            status: "ACTIVE"
        },
        select: {
            id: true,
            isDeleted: true,
            status: true
        }
    });

    return { restoredDoctor, restoredUser };
};

export const doctorService = {
    getAllDoctors,
    getDoctorById,
    doctorUpdateById,
    doctorDeleteById,
    doctorRestoreById
}
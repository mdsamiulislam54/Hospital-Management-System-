import { Doctor } from "../../../generated/client";
import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
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
            isDeleted: true,

            gender: true,
            doctorSpecialties: {

                select: {
                    doctorId: true,
                    id: true,

                    specialty: {
                        select: {
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

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: id,
            isDeleted: false
        },
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

        }
    });
    return doctor;
}

const doctorUpdateById = async (id: string, payload: Partial<Doctor>) => {
    const doctor = await prisma.doctor.update({
        where: {
            id: id,
            isDeleted: false
        },
        data: payload,
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

        }
    });
    return doctor;
}


const doctorDeleteById = async (id: string) => {
    const deletedDoctor = await prisma.doctor.update({
        where: {
            id,
            isDeleted: false
        },
        data: {

            isDeleted: true,
            deletedAt: new Date()
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

    if (!deletedDoctor.user) {
        throw new Error("User not found");
    }

    const deletedUser = await prisma.user.update({
        where: {
            id: deletedDoctor.user.id
        },
        data: {
            isDeleted: true,
            status: "INACTIVE"
        },
        select: {
            id: true,
            isDeleted: true,
            status: true
        }
    });

    return { deletedDoctor, deletedUser };
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
        throw new Error("User not found");
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
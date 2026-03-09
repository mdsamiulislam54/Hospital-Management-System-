import { Prisma } from "../../../generated/client";


export const doctorSearchableFields = ['name', 'email', 'qualification', 'designation', 'currentWorkingPlace', 'registrationNumber', 'specialties.specialty.title'];

export const doctorFilterableFields = ['gender', 'isDeleted', 'appointmentFee', 'experience', 'registrationNumber', 'specialties.specialtyId', 'currentWorkingPlace', 'designation', 'qualification', 'specialties.specialty.title', 'user.role'];

export const doctorIncludeConfig: Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    doctorSpecialties: {
        include: {
            specialty: true
        }
    },
    appointment: {
        include: {
            patient: true,
            doctor: true,

        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    prescriptions: true,
    review: true,
}
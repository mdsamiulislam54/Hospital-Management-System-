// import { Prisma } from "../../../generated/client"

import { Prisma } from "../../../generated/client"


export const scheduleFilterableFields = [
    'id',
    'startDateTime',
    'endDateTime',
    // 'appointments.doctors.id',
]

export const scheduleSearchableFields = [
    'id',
    'startDateTime',
    'endDateTime',
]

export const scheduleIncludeConfig : Partial<Record<keyof Prisma.ScheduleInclude, Prisma.ScheduleInclude[keyof Prisma.ScheduleInclude]>> ={
    doctorSchedules: {
        include: {
            doctor: true,
            appointment: true,
            schedule: true,
          
        }
    },

}
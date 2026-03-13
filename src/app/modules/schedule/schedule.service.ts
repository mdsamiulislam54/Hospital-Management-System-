import { addHours, addMinutes, format } from "date-fns";
import { ICreateSchedulePayload } from "./schedule.interface"
import { convertDateTime } from "./schedule.utils";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../../interface/query.interface";
import { scheduleFilterableFields, scheduleIncludeConfig, scheduleSearchableFields } from "./schedule.constant";
import { Prisma, Schedule } from "../../../generated/client";
import { QueryBuilder } from "../../utils/Querybuilder";

const createSchedule = async (payload: ICreateSchedulePayload) => {
    const { startDate, endDate, startTime, endTime } = payload;

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const interval = 30;
    const dateSchedule = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(new Date(currentDate), startHour),
                startMinute

            )
        )
        const endDateTime = new Date(
            addMinutes(
                addHours(new Date(currentDate), endHour),
                endMinute
            )
        )


        while (startDateTime < endDateTime) {
            const s = await convertDateTime(startDateTime);
            const e = await convertDateTime(addMinutes(startDateTime, interval));

            const scheduleData = {
                startDateTime: s,
                endDateTime: e
            };


            const isExistsSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!isExistsSchedule) {
                await prisma.schedule.create({
                    data: scheduleData
                })
                dateSchedule.push(scheduleData)
            }



            startDateTime.setMinutes(startDateTime.getMinutes() + interval)
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateSchedule
};

const getAllSchedules = async (query: IQueryParams) => {
    const queryBuilder = new QueryBuilder<Schedule, Prisma.ScheduleWhereInput, Prisma.ScheduleInclude>(
        prisma.schedule,
        query,
        {
            searchableFields: scheduleSearchableFields,
            filterableFields: scheduleFilterableFields
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .paginate()
        .dynamicInclude(scheduleIncludeConfig)
        .sort()
        .fields()
        .execute();

    return result;
}

export const ScheduleService = {
    createSchedule,
    getAllSchedules,
    // getScheduleById,
    // updateSchedule,
    // deleteSchedule
}
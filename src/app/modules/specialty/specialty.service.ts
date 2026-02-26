import { Specialty } from "../../../generated/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async(payload:Specialty) => {
    const data = await prisma.specialty.create({data: payload});
    return data;
}
const getSpecialties = async() => {
    const data = await prisma.specialty.findMany({
        orderBy:{
            createdAt: "desc"
        }
    });
    return data;
}
const getSpecialtyById = async(id:string) => {
    const data = await prisma.specialty.findUnique({where: {id}});
    return data;
}

const deleteSpecialty = async(id:string) => {
    const data = await prisma.specialty.delete({where: {id}});
    return data;
}
const updateSpecialty = async(id:string, payload:Partial<Specialty>) => {
    const data = await prisma.specialty.update({where: {id}, data: payload});
    return data;
}


export const specialtyService = {
    createSpecialty,
    getSpecialties,
    getSpecialtyById,
    deleteSpecialty,
    updateSpecialty
}
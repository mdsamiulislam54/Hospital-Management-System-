import { Admin } from "../../../generated/client"
import { prisma } from "../../lib/prisma"
import { IUpdateAdmin } from "./admin.interface"

const getAllAdmin = async () => {
    return await prisma.admin.findMany({
        where: {
            isDeleted: false
        }
    })
}

const getAdminById = async (id: string) => {
    return await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })
}

const updateAdmin = async (payload: Partial<IUpdateAdmin>, id: string) => {
    return await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: payload
    })
}
const deleteAdmin = async (id: string) => {
    return await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            updatedAt: new Date()

        },

        select: {
            id: true,
            name: true,
            email: true,
            isDeleted: true,
            updatedAt: true,
            deletedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    isDeleted: true
                }
            }

        }
    })
}


export const adminService = {
    getAdminById,
    getAllAdmin,
    updateAdmin,
    deleteAdmin
}
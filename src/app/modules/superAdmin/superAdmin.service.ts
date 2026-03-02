
import { prisma } from "../../lib/prisma"
import { IUpdateAdmin } from "../admin/admin.interface"


const getAllSuperAdmin = async () => {
    return await prisma.superAdmin.findMany({
        where: {
            isDeleted: false
        }
    })
}

const getSuperAdminById = async (id: string) => {
    return await prisma.superAdmin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })
}

const updateSuperAdmin = async (payload: Partial<IUpdateAdmin>, id: string) => {
    return await prisma.superAdmin.update({
        where: {
            id,
            isDeleted: false
        },
        data: payload
    })
}
const deleteSuperAdmin = async (id: string) => {
    return await prisma.superAdmin.update({
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


export const superAdminService = {
    getAllSuperAdmin,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}
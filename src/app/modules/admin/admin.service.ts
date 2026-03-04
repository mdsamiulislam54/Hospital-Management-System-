
import status from "http-status"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../middleware/AppError"
import { IUpdateAdmin } from "./admin.interface"
import { IUserinterface } from "../../../interface/user.interface"

const getAllAdmin = async () => {
    return await prisma.admin.findMany({
        where: {
            isDeleted: false
        }
    })
}

const getAdminById = async (id: string) => {
    const isAdminExists = await prisma.admin.findUnique({ where: { id } })
    if (!isAdminExists) {
        throw new AppError(status.NOT_FOUND, "Admin or Super admin Not Found")
    };
    return await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })
}

const updateAdmin = async (payload: Partial<IUpdateAdmin>, id: string) => {
    const isAdminExists = await prisma.admin.findUnique({ where: { id } })
    if (!isAdminExists) {
        throw new AppError(status.NOT_FOUND, "Admin or Super admin Not Found")
    };
    return await prisma.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: payload
    })
}
const deleteAdmin = async (id: string, user: IUserinterface) => {
    const isAdminExists = await prisma.admin.findUnique({ where: { id } })
    if (!isAdminExists) {
        throw new AppError(status.NOT_FOUND, "Admin or Super admin Not Found")
    };

    if (isAdminExists.userId === user.userId) {
        throw new AppError(status.BAD_REQUEST, 'You can not delete yourself ')
    }

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
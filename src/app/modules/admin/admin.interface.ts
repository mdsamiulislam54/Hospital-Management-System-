import { Gender } from "../../../generated/enums"

export interface IUpdateAdmin {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string | null;
    gender: Gender | null;
    isDeleted: boolean;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

import { IUserinterface } from "./user.interface"

declare global {
    namespace Express {
        interface Request {
            user: IUserinterface
        }
    }
}
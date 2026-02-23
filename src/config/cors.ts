import cors from 'cors';
import { envConfig } from './envConfig';
const corsConfig = cors({
    origin: [envConfig.BACKEND_URL!, envConfig.FRONTEND_URL!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
})
  

export default  corsConfig;
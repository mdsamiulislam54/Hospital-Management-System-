import cors from 'cors';
const corsConfig = cors({
    origin: [process.env.BACKEND_URL!, process.env.FRONTEND_URL!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
})
  

export default  corsConfig;
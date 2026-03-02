import dotenv from 'dotenv'
dotenv.config();
import express, { type Application } from 'express';
import corsConfig from './config/cors.js';
import { indexRouter } from './app/route/index.js';
import { globalErrorHandler } from './app/middleware/globalErrorHandler.js';
import { notFound } from './app/middleware/notFound.js';
import cookieParser from 'cookie-parser';
const app:Application = express();

app.use(express.json());
app.use(cookieParser())
app.use(corsConfig)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(indexRouter);

app.use(globalErrorHandler);
app.use(notFound)
export default app;
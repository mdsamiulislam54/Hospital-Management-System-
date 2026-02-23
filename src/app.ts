import dotenv from 'dotenv'
dotenv.config();
import express, { type Application } from 'express';
import corsConfig from './config/cors.js';
import { indexRouter } from './app/route/index.js';
const app:Application = express();

app.use(express.json());
app.use(corsConfig)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(indexRouter)

export default app;
import dotenv from 'dotenv'
dotenv.config();
import express, { type Application } from 'express';
import corsConfig from './config/cors.js';
const app:Application = express();

app.use(express.json());
app.use(corsConfig)

app.get('/', (req, res) => {
    res.send('Hello World! My name is Satyarth and I am learning MERN stack development. This is my first project using Express.js and MongoDB. I am excited to build more projects and learn new technologies in the future.');
});

export default app;
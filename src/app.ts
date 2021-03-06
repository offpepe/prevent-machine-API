import "reflect-metadata"
import express, {Express, Request, Response} from 'express';
import routes from "./routes";
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import errorMiddleware from "./middlewares/ErrorMiddleware";

dotenv.config()

const {PORT, NODE_ENV} = process.env;

logger.token('localeDate', (): string => {
    const date: Date = new Date();
    const minutes: string = date.getUTCMinutes().toString();
    const normalizedMinutes: string = minutes.length < 2 ? '0' + minutes : minutes;
    return `${date.toLocaleDateString('pt-BR')}::${date.getUTCHours() - 3}h${normalizedMinutes}m (brazilian standart time zone)`;
});

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(logger('[server]: :method --> :status ::: :url (:response-time ms) ::: :localeDate'));

app.use('/', routes);

app.get('/', (_req: Request, res: Response) => res.send(`<h1> Welcome to Prevent Machine API 🤖  </h1>
<h2>Important: Cloud service provider is unavaiable</h2>
<p> We're working to solve this issue, for now, images from issues just receives URI </p>`));
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`[server] running on port ${PORT} using ${NODE_ENV} environment`));

export default app;
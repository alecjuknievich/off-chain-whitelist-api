import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

import routes from './routes';

const app = express();
const port = 3000;
const env = (process.env.NODE_ENV || 'local').toLowerCase();
const rate_limiter = rateLimit({windowMs: 15 * 60 * 1000, max: 250});

app.use(cors({exposedHeaders: ['Content-Type']}));
app.use(compression());
app.use(helmet());
app.use(rate_limiter);
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', true);
app.set('ENV', env);
app.use(morgan('tiny'));

routes(app);

app.listen(port, () => {
    console.log(`Application running on port ${port}.`);
});




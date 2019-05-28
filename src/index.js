import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import setApi from './models/api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// console.log(process.env.mode)

// connect to db
initializeDb( db => {
		// internal middleware
		app.use(middleware({ config }));

		// api router
		setApi(app, db);
	
		app.server.listen(process.env.PORT || config.port, () => {
			console.log(`Started on port ${app.server.address().port}`);
		});
});

export default app;

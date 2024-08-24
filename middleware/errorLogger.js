import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'error-logs.log');

const logError = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - error: ${err.message} - URL: ${req.originalUrl} - IP: ${req.ip || req.connection.remoteAddress}\n`;

    fs.appendFile(logFilePath, logMessage, (error) => {
        if (error) console.error('issue with loggin error', error);
    });

    next(err); 
};

const errorHandler = (err, req, res, next) => {
    res.status(500).send('Server Erroreeeee');
};

export { logError, errorHandler };

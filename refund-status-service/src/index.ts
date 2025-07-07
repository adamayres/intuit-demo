import express from 'express';
import cookieParser from 'cookie-parser';
import refundStatusRouter from './routes/refundStatus';
import { fakeAuthMiddleware } from './middleware/fakeAuth';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(fakeAuthMiddleware);

app.use('/refund-status', refundStatusRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

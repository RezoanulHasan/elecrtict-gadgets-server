/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';

import authRoutes from './app/modules/user/authRoutes';
import cookieParser from 'cookie-parser';
import globalErrorMainHandler from './app/middlewares/globalErrorMainHandler';
import electricGadgetRoutes from './app/modules/ElectricGadge/electricGadgetRoutes';
import salesRoutes from './app/modules/sells/salesRoutes';
import cartsRoute from './app/modules/Cart/cartsRoute';
import superAdminRoutes from './app/superAdmin/superAdminRoutes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
//super admin route
app.use('/api', superAdminRoutes);
//  authentication routes
app.use('/api/auth', authRoutes);
//other route
app.use('/api', electricGadgetRoutes);
// Use the sales routes
app.use('/api', salesRoutes);

// Use the sales routes
app.use('/api', cartsRoute);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'sever is running' });
});
// Global error handler
app.use(globalErrorMainHandler);
//Not Found handler
app.use(notFound);

export default app;

import express from "express";
const app = express();
import authRoutes from './routes/auth.router.ts';
import tableRoutes from './routes/table.router.ts';
import menuRoutes from './routes/menu.router.ts';
import orderRoutes from './routes/order.router.ts';
import adminRoutes from './routes/admin.router.ts';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use('/auth', authRoutes);
app.use('/tables', tableRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    message: "API is running"
  });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
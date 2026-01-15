import express from "express";
const app = express();
import authRoutes from './routes/auth.router.js';
import tableRoutes from './routes/table.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use('/auth', authRoutes);
app.use('/tables', tableRoutes);
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
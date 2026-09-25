import express from "express";
import productRouter from "./routes/product.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();
app.use(express.json());

app.use("/products", productRouter)
app.use(errorMiddleware);

export default app;
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoute";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger 설정
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Improved Lion API",
      version: "1.0.0",
      description: "A simple Express Improved Lion API",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 라우트
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

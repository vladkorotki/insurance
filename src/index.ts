import bodyParser from "body-parser";
import express from "express";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import roleRouter from "./routes/roleRouter";
import employeeRouter from "./routes/emloyeeRouter";
import plansRouter from "./routes/plansRouter";
import cors from "cors";
import consumerRouter from "./routes/consumerRouter";
import claimsRouter from "./routes/claimsRouter"
import cookieParser from "cookie-parser";
import path from "path";

(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error(error);
  }

  const PORT = process.env.PORT || 3000;
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.use(cors());

  app.use("/api", authRouter);
  app.use("/api", userRouter);
  app.use("/api", roleRouter);
  app.use("/api", employeeRouter);
  app.use("/api", plansRouter);
  app.use("/api", consumerRouter);
  app.use("/api", claimsRouter);

  app.use(express.static('dist'));

  app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, "../dist/index.html"))
  })

  app.listen(PORT, () => console.log(`server is on process on PORT ${PORT}`));
})();

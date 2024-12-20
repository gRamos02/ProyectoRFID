import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// routes
import tarjetasRoutes from './routes/tarjetaRoutes'
import path from "path";


const app = express();
dotenv.config();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(
  // cors({
  //   origin: ["http://localhost:3000", "http://localhost:3001"],
  // })
  cors({origin: '*'})
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.use("/tarjetas", tarjetasRoutes);

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});

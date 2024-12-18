import { Router } from "express";
import { getTarjeta, createTarjeta, getAllTarjetas, renderTarjetas, deleteTarjeta, updateTarjeta } from "../controllers/tarjetas/tarjetaController";

const router = Router();

router.post("/", createTarjeta);
router.get("/", getAllTarjetas);
router.get("/:codigo", getTarjeta);
router.patch("/:codigo", updateTarjeta);
router.delete("/:codigo", deleteTarjeta);
router.get("/html/all", renderTarjetas);

export default router;

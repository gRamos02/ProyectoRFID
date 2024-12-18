import { Request, Response } from "express";
import { db } from "../../db/setup";
import { historial, tarjetas } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const createTarjeta = async (req: Request, res: Response) => {
  const codigo = req.body.codigo as string;
  const nombre = req.body.nombre as string;

  if (!codigo) {
    return res
      .status(400)
      .json({ success: false, data: null, message: "Codigo is required" });
  }

  if (!nombre) {
    return res
      .status(400)
      .json({ success: false, data: null, message: "Nombre is required" });
  }

  try {
    const tarjetaExists = await db
      .select()
      .from(tarjetas)
      .where(eq(tarjetas.codigoTarjeta, codigo));

    if(tarjetaExists.length > 0){
      return res.status(400).json({ message: "Ya existe ese codigo registrado"});
    }

    const createdTarjeta = await db.insert(tarjetas).values({
      codigoTarjeta: codigo,
      nombreUsuario: nombre,
    })

    return res.status(201).json({ status: 'created', message: 'se creo usuario'})
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ error: "server_error", message: "Internal Server Error" });
  }
};

export const getAllTarjetas = async (req: Request, res: Response) => {
  try {
    const allTarjetas = await db.select().from(tarjetas);

    return res.status(200).json({ length: allTarjetas.length, data: allTarjetas });
  } catch (error) {
    console.log("Error al consultar tarjetas", error);
    return res
      .status(500)
      .json({ error: "server_error", message: "Internal Server Error" });
  }
};

export const getTarjeta = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  console.log(codigo);
  let resultado: boolean;

  if (!codigo) {
    return res
      .status(400)
      .json({ error: "missing_parameter", message: "codigo is required" });
  }

  try {
    const tarjeta = await db
      .select()
      .from(tarjetas)
      .where(and(eq(tarjetas.codigoTarjeta, codigo), eq(tarjetas.activo, true)));

    console.log(tarjeta)

    resultado = tarjeta.length < 1 ? false : true;

    await db
      .insert(historial)
      .values({
        codigoTarjeta: codigo,
        resultado: resultado ? 'permitido' : 'denegado',
      })
    
    return res.status(resultado ? 200 : 401).json(resultado)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ error: "server_error", message: "Internal Server Error" });
  }
}

export const renderTarjetas = async (req: Request, res: Response) => {
  try {
    const allTarjetas = await db.select().from(tarjetas);
    res.render("index", { tarjetas: allTarjetas });
  } catch (error) {
    console.error("Error al renderizar tarjetas", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const deleteTarjeta = async (req: Request, res: Response) => {
  const { codigo } = req.params;

  if (!codigo) {
    return res.status(400).json({
      success: false,
      message: "El código de la tarjeta es requerido.",
    });
  }

  try {
    const result = await db.delete(tarjetas).where(eq(tarjetas.codigoTarjeta, codigo));

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Tarjeta con código ${codigo} eliminada correctamente.`,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Tarjeta no encontrada.",
      });
    }
  } catch (error) {
    console.error("Error al eliminar tarjeta:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};


export const updateTarjeta = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const { nombre, activo } = req.body;

  if (!codigo) {
    return res.status(400).json({
      success: false,
      message: "El código de la tarjeta es requerido.",
    });
  }

  if (nombre === undefined && activo === undefined) {
    return res.status(400).json({
      success: false,
      message: "Se requiere al menos un campo para actualizar (nombre o activo).",
    });
  }

  try {
    const updates: Partial<typeof tarjetas> = {};
    if (nombre !== undefined) updates.nombreUsuario = nombre;
    if (activo !== undefined) updates.activo = activo;

    const result = await db
      .update(tarjetas)
      .set({
        nombreUsuario: nombre,
        activo
      })
      .where(eq(tarjetas.codigoTarjeta, codigo));

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Tarjeta con código ${codigo} actualizada correctamente.`,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Tarjeta no encontrada.",
      });
    }
  } catch (error) {
    console.error("Error al actualizar tarjeta:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};
import { Request, Response, NextFunction } from "express";
import { UserType, Usuario } from "./usuario.entity.js";
import { orm } from "../shared/db/orm.js";
import { NotFoundError, ObjectId } from "@mikro-orm/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const em = orm.em; 

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		nombre: req.body.nombre?.trim(),
		email: req.body.email?.trim().toLowerCase(),
		password: req.body.password,
		tipo: req.body.tipo,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});

	next();
}

interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		userType: UserType;
	};
}

async function login(req: Request, res: Response) {
	try {
	  const { email, password } = req.body;
  
	  if (!email || !password) {
		return res
		  .status(400)
		  .json({ message: "Email y contraseña son requeridos" });
	  }
  
	  const usuario = await em.findOne(Usuario, {
		email: email.trim().toLowerCase(),
	  });
  
	  if (!usuario) {
		return res.status(401).json({ message: "Credenciales inválidas" });
	  }
  
	  const passwordMatch = await bcrypt.compare(password, usuario.password);
  
	  if (!passwordMatch) {
		return res.status(401).json({ message: "Credenciales inválidas" });
	  }
  
	  const token = jwt.sign(
		{
		  userId: usuario.id,
		  userType: usuario.tipo,
		},
		process.env.JWT_SECRET || 'secreto',
		{ expiresIn: "1h" }
	  );
  
	  const { _id, password: _, ...userWithoutPassword } = usuario;
	  if (!_id) {
		return res.status(500).json({ message: "Error: _id no encontrado" });
	  }
	  const userResponse = { id: _id.toString(), ...userWithoutPassword };
  
	  res.status(200).json({
		message: "Login exitoso",
		data: {
		  token,
		  user: userResponse,
		},
	  });
	} catch (error: any) {
	  res.status(500).json({ message: error.message });
	}
  }
  
  async function getMe(req: AuthenticatedRequest, res: Response) {
	try {
	  const userId = req.user?.userId;
  
	  if (!userId) {
		return res.status(401).json({ message: "No autorizado" });
	  }
  
	  const usuario = await em.findOneOrFail(
		Usuario,
		{ _id: ObjectId.createFromHexString(userId) },
		{ 
		  populate: [
			'entradas', 
          'entradas.funcion', 
          'entradas.funcion.sala', 
          'entradas.funcion.pelicula', 
          'entradas.asiento', 
          'entradas.asiento.sala'
		  ] 
		}
	  );
  
	  const { password, _id, entradas, ...rest } = usuario;
	  
	  const entradasFormateadas = usuario.entradas.getItems().map(entrada => ({
		id: entrada.id,
		precio: entrada.precio,
		fechaCompra: entrada.fechaCompra,
		funcion: {
		  id: entrada.funcion.id,
		  fechaHora: entrada.funcion.fechaHora,
		  precio: entrada.funcion.precio,
		  sala: entrada.funcion.sala ? {
			id: entrada.funcion.sala.id,
			nombre: entrada.funcion.sala.nombre
		  } : null,
		  pelicula: {
			id: entrada.funcion.pelicula.id,
			nombre: entrada.funcion.pelicula.nombre,
			duracion: entrada.funcion.pelicula.duracion
		  }
		},
		asiento: {
		  id: entrada.asiento.id,
		  fila: entrada.asiento.fila,
		  numero: entrada.asiento.numero,
		  sala: entrada.asiento.sala ? {
			id: entrada.asiento.sala.id,
			nombre: entrada.asiento.sala.nombre
		  } : null
		}
	  }));
  
	  const safeUser = {
		...rest,
		id: _id!.toString(), 
		entradas: entradasFormateadas
	  };
  
	  res.status(200).json({
		message: "Usuario autenticado",
		data: safeUser
	  });
	} catch (error) {
	  res.status(404).json({ message: "Usuario no encontrado" });
	  console.error(error) 
	}
  }
  

async function findAll(req: Request, res: Response) {
	try {
		const usuarios = await em.find(Usuario, {}, { populate: ["entradas"] });
		res.status(200).json({ message: "Todos los usuarios", data: usuarios });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const usuario = await em.findOneOrFail(
			Usuario,
			{ _id: new ObjectId(id) },
			{ populate: ["entradas"] }
		);
		res.status(200).json({ message: "Usuario encontrado", data: usuario });
	} catch (error: any) {
		res.status(404).json({ message: "Usuario no encontrado" });
	}
}

async function add(req: Request, res: Response) {
	try {
		const input = req.body.sanitizedInput;

		if (!input.nombre || !input.email || !input.password) {
			throw new Error("Nombre, email y password son obligatorios");
		}

		input.tipo = UserType.COMUN;

		const existeUsuario = await em.findOne(Usuario, { email: input.email });
		if (existeUsuario) {
			throw new Error("El email ya está registrado");
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(input.password, saltRounds);

		const usuario = em.create(Usuario, {
			...input,
			password: hashedPassword,
		});

		await em.flush();
		res.status(201).json({ message: "Usuario creado", data: usuario });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = new ObjectId(req.params.id);
		const usuario = await em.findOneOrFail(Usuario, { _id: id });
		const input = req.body.sanitizedInput;

		const reqAuth = req as AuthenticatedRequest;
		const currentUser = reqAuth.user;

		if (!currentUser) {
			return res.status(401).json({ message: "No autenticado" });
		}

		if (
			currentUser.userId !== usuario.id &&
			currentUser.userType !== UserType.ADMIN
		) {
			return res
				.status(403)
				.json({ message: "No tienes permisos para esta acción" });
		}

		if (input.tipo && currentUser.userType !== UserType.ADMIN) {
			delete input.tipo;
		}

		if (input.email && input.email !== usuario.email) {
			const existeEmail = await em.findOne(Usuario, {
				email: input.email,
			});
			if (existeEmail) {
				return res
					.status(400)
					.json({ message: "El email ya está registrado" });
			}
		}

		if (input.password) {
			input.password = await bcrypt.hash(input.password, 10);
		}

		em.assign(usuario, input);
		await em.flush();

		const { password: _, ...safeUser } = usuario;
		res.status(200).json({
			message: "Usuario actualizado",
			data: safeUser,
		});
	} catch (error: any) {
		const statusCode = error instanceof NotFoundError ? 404 : 400;
		res.status(statusCode).json({ message: error.message });
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = new ObjectId(req.params.id);
		const usuario = await em.findOneOrFail(
			Usuario,
			{ _id: id },
			{ populate: ["entradas"] }
		);

		const reqAuth = req as AuthenticatedRequest;
		const currentUser = reqAuth.user;

		if (
			!currentUser ||
			(currentUser.userType !== UserType.ADMIN &&
				currentUser.userId !== usuario.id)
		) {
			return res.status(403).json({ message: "Acceso no autorizado" });
		}

		if (usuario.entradas.length > 0) {
			usuario.entradas.removeAll();
			await em.flush();
		}

		await em.removeAndFlush(usuario);
		res.status(200).json({ message: "Usuario eliminado" });
	} catch (error: any) {
		res.status(404).json({ message: "Usuario no encontrado" });
	}
}

export { sanitizeUsuarioInput, findAll, findOne, add, update, remove, login, getMe };

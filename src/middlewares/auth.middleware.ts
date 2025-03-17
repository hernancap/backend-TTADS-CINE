import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserType } from '../usuario/usuario.entity.js';

interface AuthenticatedRequest extends Request {
    user?: {
      userId: string;
      userType: UserType;
    };
  }

  export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto') as {
        userId: string;
        userType: UserType;
      };
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido" });
    }
  };

  export const authAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || req.user.userType !== UserType.ADMIN) {
      return res.status(403).json({
        message: 'Acceso denegado: solo los administradores pueden realizar esta acción',
      });
    }
    next();
  };
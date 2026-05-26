import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos Request para incluir el userId
export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Obtenemos el token del header (formato: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'supersecreto123';
        // Verificamos el token con nuestro secret
        const verified = jwt.verify(token, secret);
        // Guardamos los datos del usuario en la request
        req.user = verified;
        next(); // Pasamos al siguiente middleware/controlador
    } catch (error) {
        res.status(401).json({ error: 'Token no válido o ha expirado.' });
    }
};

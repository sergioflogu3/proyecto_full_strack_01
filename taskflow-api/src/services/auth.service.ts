import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { RegisterDto, LoginDto, AuthResponse, JwtPayload } from '../types/auth.types';

const SALT_ROUNDS = 10;

export const authService = {

  async register(data: RegisterDto): Promise<AuthResponse> {
    // 1. Verificar que el email no esté tomado
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw { status: 409, message: 'El email ya está registrado' };

    // 2. Hashear la contraseña
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // 3. Crear el usuario en la BD
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // 4. Generar y devolver el token
    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user };
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    // 1. Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // 2. Verificar credenciales (mensaje genérico para no revelar si el email existe)
    const INVALID_MSG = 'Credenciales inválidas';
    if (!user) throw { status: 401, message: INVALID_MSG };

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatch) throw { status: 401, message: INVALID_MSG };

    // 3. Generar y devolver token
    const token = generateToken({ userId: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },
};

// Helper privado: genera un JWT firmado
function generateToken(payload: JwtPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expiresIn as unknown as number,
  });
}

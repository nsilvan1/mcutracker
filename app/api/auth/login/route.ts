import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { loginSchema, formatZodErrors } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'mcu-tracker-secret-key-2026';

export async function POST(request: NextRequest) {
  // Rate limiting for auth endpoints (stricter)
  const rateLimitResponse = await withRateLimit(request, rateLimitConfigs.auth);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await dbConnect();

    const body = await request.json();

    // Validação com Zod
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodErrors(validation.error) },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        watchedItems: user.watchedItems,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login. Tente novamente.' },
      { status: 500 }
    );
  }
}

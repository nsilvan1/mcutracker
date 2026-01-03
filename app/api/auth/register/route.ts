import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { registerSchema, formatZodErrors } from '@/lib/validations';

export async function POST(request: NextRequest) {
  // Rate limiting for auth endpoints (stricter)
  const rateLimitResponse = await withRateLimit(request, rateLimitConfigs.auth);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await dbConnect();

    const body = await request.json();

    // Validação com Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodErrors(validation.error) },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      watchedItems: [],
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'mcu-tracker-secret-key-2026';

// Middleware para verificar token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET - Buscar progresso do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(userId).select('watchedItems');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      watchedItems: user.watchedItems,
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar progresso' },
      { status: 500 }
    );
  }
}

// POST - Atualizar progresso do usuário
export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { watchedItems } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { watchedItems },
      { new: true }
    ).select('watchedItems');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      watchedItems: user.watchedItems,
    });
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    );
  }
}

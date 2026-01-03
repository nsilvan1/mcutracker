import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'mcu-tracker-secret-key-2026';

// GET - Obter preferências do usuário
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await dbConnect();

    const user = await User.findById(decoded.userId).select('preferences');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: user.preferences || {
        hideWhatsNew: false,
        hideOnboarding: false,
        hideSpoilerWarning: false,
        lastSeenVersion: '0.0.0',
      },
    });
  } catch (error) {
    console.error('Erro ao obter preferências:', error);
    return NextResponse.json(
      { error: 'Erro ao obter preferências' },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar preferências do usuário
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();

    await dbConnect();

    // Validar campos permitidos
    const allowedFields = ['hideWhatsNew', 'hideOnboarding', 'hideSpoilerWarning', 'lastSeenVersion'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[`preferences.${field}`] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualizar' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updates },
      { new: true }
    ).select('preferences');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar preferências' },
      { status: 500 }
    );
  }
}

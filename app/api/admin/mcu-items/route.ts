import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import MCUItem from '@/models/MCUItem';

const JWT_SECRET = process.env.JWT_SECRET || 'mcu-tracker-secret-key-2026';

// Verificar se o usuário é admin
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token não fornecido', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    await dbConnect();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'Usuário não encontrado', status: 404 };
    }

    if (!user.isAdmin) {
      return { error: 'Acesso negado. Você não é administrador.', status: 403 };
    }

    return { user };
  } catch (error) {
    return { error: 'Token inválido', status: 401 };
  }
}

// GET - Listar todas as alterações de MCU items
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request);

    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    const items = await MCUItem.find({}).sort({ itemId: 1 });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error: any) {
    console.error('Erro ao buscar MCU items:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados.' },
      { status: 500 }
    );
  }
}

// POST - Criar ou atualizar um MCU item
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request);

    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { itemId, trailerUrl, trailerUrlDublado, trailerUrlLegendado, customDescription, customSynopsis, customImageUrl, customBackdropUrl } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'ID do item é obrigatório' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upsert - criar ou atualizar
    const updatedItem = await MCUItem.findOneAndUpdate(
      { itemId },
      {
        itemId,
        trailerUrl,
        trailerUrlDublado,
        trailerUrlLegendado,
        customDescription,
        customSynopsis,
        customImageUrl,
        customBackdropUrl,
        updatedBy: authResult.user.email,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Item atualizado com sucesso!',
    });
  } catch (error: any) {
    console.error('Erro ao atualizar MCU item:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar dados.' },
      { status: 500 }
    );
  }
}

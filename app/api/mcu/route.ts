import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MCUItem from '@/models/MCUItem';

// GET - Buscar todas as alterações dos MCU items (público)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const dbItems = await MCUItem.find({});

    // Converter para um objeto indexado por itemId para fácil acesso
    const itemsMap: Record<string, any> = {};
    dbItems.forEach(item => {
      itemsMap[item.itemId] = {
        trailerUrl: item.trailerUrl,
        trailerUrlDublado: item.trailerUrlDublado,
        trailerUrlLegendado: item.trailerUrlLegendado,
        customDescription: item.customDescription,
        customSynopsis: item.customSynopsis,
        customImageUrl: item.customImageUrl,
        customBackdropUrl: item.customBackdropUrl,
      };
    });

    return NextResponse.json({
      success: true,
      items: itemsMap,
    });
  } catch (error: any) {
    console.error('Erro ao buscar MCU items:', error);
    // Em caso de erro, retornar vazio para usar dados locais
    return NextResponse.json({
      success: true,
      items: {},
    });
  }
}

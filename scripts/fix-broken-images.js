const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nsnunes:magbserv01@frisck.8lr5dxi.mongodb.net/mcu-tracker';

async function fixBrokenImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    const db = mongoose.connection.db;
    const mcuItemsCollection = db.collection('mcuitems');

    // Buscar todos os itens com URLs problemáticas
    const itemsWithBrokenImages = await mcuItemsCollection.find({
      $or: [
        { customImageUrl: { $regex: /wikia\.nocookie\.net/i } },
        { customImageUrl: { $regex: /glKDfE6btIRcVB5zrjspRFs4ltW/i } },
        { customImageUrl: { $regex: /7PiOxc7zqIqL9hg8G4imtcaOZKS/i } },
        { customImageUrl: { $regex: /kSBXou5m7dm65oV1By2h6h5nT5V/i } },
        { customImageUrl: { $regex: /cdkyMYdu8ao26XOBZhH0Znavt7X/i } },
        { customImageUrl: { $regex: /4W6fS3V9K7Y9NdEwLF6V5qk5T3t/i } },
        { customBackdropUrl: { $regex: /wikia\.nocookie\.net/i } },
      ]
    }).toArray();

    console.log(`\nEncontrados ${itemsWithBrokenImages.length} itens com URLs problemáticas:`);
    
    itemsWithBrokenImages.forEach(item => {
      console.log(`- ${item.itemId}: ${item.customImageUrl || item.customBackdropUrl}`);
    });

    if (itemsWithBrokenImages.length === 0) {
      console.log('\nNenhum item com URL problemática encontrado!');
      await mongoose.disconnect();
      return;
    }

    // Remover as URLs problemáticas (definir como null)
    const result = await mcuItemsCollection.updateMany(
      {
        $or: [
          { customImageUrl: { $regex: /wikia\.nocookie\.net/i } },
          { customImageUrl: { $regex: /glKDfE6btIRcVB5zrjspRFs4ltW/i } },
          { customImageUrl: { $regex: /7PiOxc7zqIqL9hg8G4imtcaOZKS/i } },
          { customImageUrl: { $regex: /kSBXou5m7dm65oV1By2h6h5nT5V/i } },
          { customImageUrl: { $regex: /cdkyMYdu8ao26XOBZhH0Znavt7X/i } },
          { customImageUrl: { $regex: /4W6fS3V9K7Y9NdEwLF6V5qk5T3t/i } },
          { customBackdropUrl: { $regex: /wikia\.nocookie\.net/i } },
        ]
      },
      {
        $unset: {
          customImageUrl: "",
          customBackdropUrl: ""
        }
      }
    );

    console.log(`\n✅ ${result.modifiedCount} itens atualizados com sucesso!`);
    console.log('As URLs problemáticas foram removidas do banco de dados.');
    console.log('O sistema agora usará as URLs padrão do arquivo mcu-data.ts.');

    await mongoose.disconnect();
    console.log('\nDesconectado do MongoDB');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

fixBrokenImages();


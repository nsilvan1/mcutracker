const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://nsnunes:magbserv01@frisck.8lr5dxi.mongodb.net/mcu-tracker';

async function checkUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Buscar o usuario pelo ID
    const userId = '695838920392c2ef8f74d1d5';

    // Tentar buscar por ObjectId
    const { ObjectId } = require('mongoose').Types;

    let user;
    try {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    } catch (e) {
      // Se falhar, tentar buscar como string
      user = await usersCollection.findOne({ _id: userId });
    }

    if (user) {
      console.log('\n=== Usuario encontrado ===');
      console.log('ID:', user._id);
      console.log('Nome:', user.name);
      console.log('Email:', user.email);
      console.log('isAdmin:', user.isAdmin);
      console.log('watchedItems:', user.watchedItems?.length || 0, 'itens');
      console.log('\nDocumento completo:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('Usuario nao encontrado com ID:', userId);

      // Listar todos os usuarios
      console.log('\n=== Todos os usuarios ===');
      const allUsers = await usersCollection.find({}).toArray();
      allUsers.forEach(u => {
        console.log(`- ${u._id}: ${u.name} (${u.email}) - isAdmin: ${u.isAdmin || false}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

checkUser();

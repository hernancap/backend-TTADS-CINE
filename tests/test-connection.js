import { MongoClient } from "mongodb";

const uri = `mongodb+srv://hernancaparros:${process.env.MONGODB_PASSWORD}@cluster0.jlbuugw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function run() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('cine'); 
    const peliculas = db.collection('peliculas');

    await peliculas.insertOne({
      name: 'Inception',
      genre: 'Science Fiction',
      duration: 148,
      director: 'Christopher Nolan',
      actors: []
    });

    await peliculas.insertOne({
      name: 'The Matrix',
      genre: 'Action, Science Fiction',
      duration: 136,
      director: 'Lana Wachowski, Lilly Wachowski',
      actors: []
    });

    const todasLasPeliculas = await peliculas.find().toArray();
    console.log('Películas:', todasLasPeliculas);

  } finally {
    await client.close();
  }
}

run().catch(console.error);

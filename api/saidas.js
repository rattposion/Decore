import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "relatorios";

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("saidas");

  if (req.method === "GET") {
    // Listar todas as saídas
    const saidas = await collection.find({}).toArray();
    res.status(200).json(saidas);
  } else if (req.method === "POST") {
    // Criar nova saída
    const novaSaida = req.body;
    await collection.insertOne(novaSaida);
    res.status(201).json({ ok: true });
  } else if (req.method === "DELETE") {
    // Deletar saída (espera _id no body)
    const { _id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(_id) });
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
  await client.close();
} 
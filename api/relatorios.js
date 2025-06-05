import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "relatorios";

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("relatorios");

  if (req.method === "GET") {
    // Listar todos os relatórios
    const relatorios = await collection.find({}).toArray();
    res.status(200).json(relatorios);
  } else if (req.method === "POST") {
    // Criar novo relatório
    const novoRelatorio = req.body;
    await collection.insertOne(novoRelatorio);
    res.status(201).json({ ok: true });
  } else if (req.method === "PUT") {
    // Editar relatório (espera _id no body)
    const { _id, ...rest } = req.body;
    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: rest });
    res.status(200).json({ ok: true });
  } else if (req.method === "DELETE") {
    // Deletar relatório (espera _id no body)
    const { _id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(_id) });
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
  await client.close();
} 
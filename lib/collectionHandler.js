import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

/**
 * Generic CRUD handler factory for simple ordered collections
 * (skills, certificates, projects, education). Reads are public;
 * writes are already gated by middleware.js, which checks the
 * admin session cookie before this code ever runs.
 */
export function createCollectionHandler(collectionName) {
  return async function handler(req, res) {
    const db = await getDb();
    const col = db.collection(collectionName);

    try {
      if (req.method === 'GET') {
        const items = await col.find({}).sort({ order: 1, _id: 1 }).toArray();
        return res.status(200).json(items);
      }

      if (req.method === 'POST') {
        const body = { ...req.body };
        delete body._id;
        if (typeof body.order !== 'number') {
          const count = await col.countDocuments();
          body.order = count;
        }
        const result = await col.insertOne(body);
        return res.status(201).json({ _id: result.insertedId, ...body });
      }

      if (req.method === 'PUT') {
        const { _id, ...rest } = req.body || {};
        if (!_id) return res.status(400).json({ error: 'Missing _id' });
        await col.updateOne({ _id: new ObjectId(_id) }, { $set: rest });
        return res.status(200).json({ ok: true });
      }

      if (req.method === 'DELETE') {
        const { _id } = req.body || {};
        if (!_id) return res.status(400).json({ error: 'Missing _id' });
        await col.deleteOne({ _id: new ObjectId(_id) });
        return res.status(200).json({ ok: true });
      }

      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
}

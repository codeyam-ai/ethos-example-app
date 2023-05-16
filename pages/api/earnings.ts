
import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  


  res.status(200).json({ response: 'YO!'});
}
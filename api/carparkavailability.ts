import type { Request, Response } from 'express';

const LTA_CARPARK_API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // e.g. "1.30388 103.83226" (latitude longitude)
  AvailableLots: number;
  LotType: string; // "C" for Cars, "H" for Heavy, "Y" for Motorcycles
  Agency: string; // "HDB", "LTA", "URA"
}

export interface LTACarparkResponse {
  'odata.metadata'?: string;
  value: LTACarparkItem[];
}

export default async function handler(req: Request, res: Response) {
  // Read key dynamically from process.env (not hardcoded)
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;

  if (!ltaAccountKey) {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY_NOT_CONFIGURED',
      message: 'LTA DataMall AccountKey is not configured on the server. Please set the LTA_ACCOUNT_KEY environment variable.',
      docs: 'Request an AccountKey at https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
    });
  }

  try {
    const querySkip = req.query.$skip ? String(req.query.$skip) : undefined;
    const targetUrl = new URL(LTA_CARPARK_API_URL);
    if (querySkip) {
      targetUrl.searchParams.set('$skip', querySkip);
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        AccountKey: ltaAccountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      return res.status(response.status).json({
        error: 'LTA_DATAMALL_ERROR',
        status: response.status,
        statusText: response.statusText,
        details: errorBody,
      });
    }

    const data: LTACarparkResponse = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error querying LTA CarParkAvailabilityv2:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: error?.message || 'Failed to fetch CarParkAvailabilityv2 from LTA DataMall',
    });
  }
}

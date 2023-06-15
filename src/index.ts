
import express, { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import data from './data.json';
import data1 from './data1.json';
import cors from 'cors';
import { getConversationidtable } from './Kusto/kustoclient';
import moment from 'moment';

const connectionSecret ='x6b8Q~gvrWaCvxbzprAwDkMzfjKKPNCqg~-wKctA'

const app = express();
app.use(cors());


type QueryType = {
  fromDate: string;
  toDate: string;
  tenantId: string;
  userId: string;
}
app.get('/api/user_data', async(req: Request, res: Response, next: NextFunction) => {
  const { tenantId, userId,fromDate, toDate } = req.query as QueryType;
  console.log(req.query);

  console.log(fromDate,toDate);
  // if (isNaN(from) || isNaN(to)) {
  //   return res
  //     .status(400)
  //     .json({ error: 'Invalid time range. Please provide integer values for start_time and end_time.' });
  // }

  // const filteredData = data.filter((entry: { tenantid: string; userid: string; timestamp: number }) =>
  //   entry.tenantid === tenantid && entry.userid === userid && entry.timestamp >= from && entry.timestamp <= to
  // );
  const result = await getConversationidtable(connectionSecret, tenantId, userId,fromDate, toDate);


  console.log(result);

  res.json(result);
});

app.get('/api/get_data1', (req: Request, res: Response, next: NextFunction) => {
  const { conversationid, timestamp } = req.query;
  const epocs = parseInt(timestamp as string,10);
  if (isNaN(epocs)) {
    return res
      .status(400)
      .json({ error: 'Invalid time range. Please provide integer values for start_time and end_time.' });
  }
  console.log(conversationid, epocs);
  const filteredData = data1.filter((entry: { conversationid: number; time: number }) =>
    entry.conversationid === parseInt(conversationid as string,10) && entry.time === epocs
  );
  console.log('filtered: ', filteredData);
  res.json(filteredData);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});




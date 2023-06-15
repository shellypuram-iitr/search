import {
  Client as KustoClient,
  KustoConnectionStringBuilder,
} from "azure-kusto-data";
import { KustoResponseDataSet } from "azure-kusto-data/types/src/response";

async function getKustoClient(connectionSecret: string) {
    const clusterName = "aria05";
    const connectionString = `https://${clusterName}.kusto.windows.net`;
    const connectionAppId = "e497803a-22ef-4f32-8581-19f2947e6f94";
    const authorityId = "72f988bf-86f1-41af-91ab-2d7cd011db47";

    const kcs = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
      connectionString,
      connectionAppId,
      connectionSecret,
      authorityId
    );

    return new KustoClient(kcs);
  }

  function getConversationids(tenantid: string, userid: string, From: string, To: string): string {

    // return `
    // responsereceived
    // | take 10;
    // `;

    return `
    responsereceived | where TenantInfo_OmsId == "${tenantid}"
    | where UserInfo_Id == "${userid}"
    | where EventInfo_Time between (datetime(${From}) .. datetime(${To}))
    | project ConversationId, EventInfo_Time, AppInfo_Component, result
    `;
  }

  export async function getConversationidtable(
    connectionSecret: string,
    tenantId: string,
    userId: string,
    fromDate: string,
    toDate: string
  ): Promise<KustoResponseDataSet> {
    const database = "21d9f63f7fbc4707beb42a3e1e4917be";
    const kustoClient = await getKustoClient(connectionSecret);
    console.log(tenantId, userId,fromDate, toDate);

    let results;
    try {
      results = await kustoClient.execute(database, getConversationids(tenantId, userId,fromDate, toDate));
    } catch (e) {
      console.log(e);
    }



    return results;
  }










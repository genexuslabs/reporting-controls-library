import { ServiceType } from "../common/basic-types";
import { SERVICE_POST_INFO_MAP } from "./services-manager";
import { QueryViewer } from "./types/json";

export class gxqueryConnector
{
    private static _baseUrl: string;
    private static _connecting: boolean;
    private static _connected: boolean;
    private static _currentSession: session;
    private static _currentMetadata: metadata;
 
    /**
     * Starts a session in GXquery and gets the id for a metadata given its name
     */
    private static async connect(options: gxqueryOptions)
    {
        console.log("Connecting to GXquery...");
        gxqueryConnector._connecting = true;
        gxqueryConnector._baseUrl = options.BaseUrl;
        let resObj: gxqueryServiceResponse = await gxqueryConnector.getMetadataByName(options.MetadataName);
        if (resObj.Errors.length == 0) {
            gxqueryConnector._connected = true;
            console.log("Connected.");
        }
        else
            console.log("Connection failed: " + resObj.Errors[0].Message);
        gxqueryConnector._connecting = false;
        return resObj;
    }

    private static async checkConnection(options: gxqueryOptions) {
        let resObj: gxqueryServiceResponse;
        if (gxqueryConnector._connected)
            resObj = { Errors: [] } ;
        else if (!gxqueryConnector._connecting)
            resObj = await gxqueryConnector.connect(options);
        else {
            do {
                console.log("Waiting connection...");
                await gxqueryConnector.sleep(1000);
            } while (!gxqueryConnector._connected);
            console.log("Connection found.");
            resObj = { Errors: [] } ;
        }
        return resObj;
    }
    
    private static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Calls any REST service
     */
    private static async callRESTService(service: string, method: string, serviceParameters: string) {
        let serviceURL = gxqueryConnector._baseUrl + service;
        let body: string;
        if (method == 'GET' || method == 'DELETE')
            serviceURL += '?' + serviceParameters;
        else if (method == 'PUT' || method == 'POST')
            body = serviceParameters;
        let fetchOptions: fetchOptions = {
            method: method,
            cache: 'no-store',
            headers: {
            'Content-Type': 'application/json'
            },
            body: body
        };
        if (gxqueryConnector._currentSession)
            fetchOptions.headers.Authorization = 'OAuth ' + gxqueryConnector._currentSession.Token;
        let resObj: gxqueryServiceResponse;
        try {
            let response = await fetch(serviceURL, fetchOptions);
            if (response.ok)
                resObj = await response.json();
            else
                resObj = { Errors: [{ Code: response.status, Message: response.statusText }] };
        }
        catch (err) {
            resObj = { Errors: [{ Code: -1, Message: err.message }] };
        }
        if (resObj.Errors.length > 0)
            console.log("ERROR: " + resObj.Errors[0].Message);
        return resObj;
    }
 
    /**
     * Executes a login in GXquery
     */
    private static async login() {
        let serviceParameters;
        serviceParameters = { RepositoryName: '', UserName: 'administrator', UserPassword: 'administrator123' };
        let resObj: gxqueryServiceResponse = await gxqueryConnector.callRESTService('/Session/Login', "POST", JSON.stringify(serviceParameters));
        if (resObj.Errors.length == 0) {
            console.log("Login successful.");
            gxqueryConnector._currentSession = (resObj as loginResponse).Session;
        }
        return resObj;
    }
    
    /**
     * Gets a metadata given its name
     */
    private static async getMetadataByName(metadataName: string) {
        let resObj: gxqueryServiceResponse = { Errors: [] };
        if (!gxqueryConnector._currentSession)
            resObj = await this.login();
        if (resObj.Errors.length == 0) {
            let serviceParameters = `Name=${metadataName}`;
            resObj = await gxqueryConnector.callRESTService('/Metadata/GetByName', "GET", serviceParameters);
            if (resObj.Errors.length == 0) {
                console.log("Get metadata by name successful.");
                gxqueryConnector._currentMetadata = (resObj as getMetadataResponse).Metadata;
            }
        }
        return resObj;
    }

    /**
    * Gets a query given its name
    */
    private static async getQueryByName(qViewer: QueryViewer, queryName: string) {
        let resObj: gxqueryServiceResponse = { Errors: [] };
        if (resObj.Errors.length == 0) {
            let serviceParameters = `MetadataId=${gxqueryConnector._currentMetadata.Id}&Name=${queryName}`;
            resObj = await gxqueryConnector.callRESTService('/Query/GetByName', "GET", serviceParameters);
            if (resObj.Errors.length == 0) {
                console.log("Get query by name successful.");
                qViewer.QueryObj = (resObj as getQueryByNameResponse).Query;
            }
        }
        return resObj;
    }

    private static setQueryViewerProperties(qViewer: QueryViewer) {
        qViewer.Properties = {
            "OutputType": qViewer.QueryObj.OutputType,
            "Title": qViewer.QueryObj.Title,
            "ShowValues": qViewer.QueryObj.ShowValues,
            "ShowDataAs": qViewer.QueryObj.ShowDataAs,
            "Orientation": qViewer.QueryObj.Orientation,
            "IncludeTrend": qViewer.QueryObj.IncludeTrend,
            "IncludeSparkline": qViewer.QueryObj.IncludeSparkline,
            "IncludeMaxAndMin": qViewer.QueryObj.IncludeMaxAndMin,
            "ChartType": qViewer.QueryObj.ChartType,
            "PlotSeries": qViewer.QueryObj.PlotSeries,
            "XAxisLabels": qViewer.QueryObj.XAxisLabels,
            "XAxisIntersectionAtZero": qViewer.QueryObj.XAxisIntersectionAtZero,
            "XAxisTitle": qViewer.QueryObj.XAxisTitle,
            "YAxisTitle": qViewer.QueryObj.YAxisTitle,
            "MapType": qViewer.QueryObj.MapType,
            "Region": qViewer.QueryObj.Region,
            "Continent": qViewer.QueryObj.Continent,
            "Country": qViewer.QueryObj.Country,
            "Paging": qViewer.QueryObj.Paging,
            "PageSize": qViewer.QueryObj.PageSize,
            "ShowDataLabelsIn": qViewer.QueryObj.ShowDataLabelsIn,
            "TotalForRows": qViewer.QueryObj.TotalForRows,
            "TotalForColumns": qViewer.QueryObj.TotalForColumns
        };
    }

    /**
     * Calls a QueryViewer service (data, metadata, etc)
     */
    public static async callGXqueryService(qViewer: QueryViewer, options:gxqueryOptions, serviceType: ServiceType) {
        await gxqueryConnector.checkConnection(options);
        let resJson: gxqueryServiceResponse = { Errors: [] };
        let service: string;
        switch (serviceType)
        {
        case service = "metadata":
            service = "/QueryViewer/GetMetadata";
            break;
        case service = "data":
            service = "/QueryViewer/GetData";
            break;
        }
        let postInfo = JSON.stringify(SERVICE_POST_INFO_MAP[serviceType](qViewer));
        if (!qViewer.QueryObj ||
            (options.QueryName != "" && qViewer.QueryObj.Name != options.QueryName) ||
            (options.QueryName == "" && qViewer.QueryObj.Expression != options.Query.Expression)) {
            if (!options.QueryName)
                qViewer.QueryObj = options.Query;
            else
                resJson = await gxqueryConnector.getQueryByName(qViewer, options.QueryName);
            gxqueryConnector.setQueryViewerProperties(qViewer);
        }
        if (resJson.Errors.length == 0) {
            let serviceParameters = { MetadataId: gxqueryConnector._currentMetadata.Id, QueryId: qViewer.QueryObj.Id, PostInfoJSON: postInfo };
            resJson = await gxqueryConnector.callRESTService(service, "POST", JSON.stringify(serviceParameters));
        }
        if (resJson.Errors.length == 0) {
            console.log("Call " + serviceType + " service successful.");
            switch (serviceType)
            {
                case service = "metadata":
                    return (resJson as qvMetadataServiceResponse).Metadata;
                case service = "data":
                    return (resJson as qvDataServiceResponse).Data;
                default:
                    return "";
            }
        }
        else
            throw new Error(resJson.Errors[0].Message);
    }
}

class fetchOptions {
    method: string;
    cache: RequestCache;
    headers: { [key: string]: string };
    body: string;
} 
    
class session {
    Token: string;
}
  
class metadata {
    Id: string;
    Name: string;
}
  
export class query {
    Id: string;
    Name: string;
    Description: string;
    Expression: string;
    Modified: string;
    RemoveDuplicates: boolean;
    MaxRows: string;
    TextForNullValues: string;
    OutputType: string;
    Title: string;
    ShowValues: boolean;
    ShowDataAs: string;
    Orientation: string;
    IncludeTrend: boolean
    IncludeSparkline: boolean
    IncludeMaxAndMin: boolean
    ChartType: string;
    PlotSeries: string;
    XAxisLabels: string;
    XAxisIntersectionAtZero: boolean;
    XAxisTitle: string;
    YAxisTitle: string;
    MapType: string;
    Region: string;
    Continent: string;
    Country: string;
    Paging: boolean;
    PageSize: number;
    ShowDataLabelsIn: string;
    TotalForRows: string;
    TotalForColumns: string;
}

export type queryOutputProperty = "OutputType" | "Title" | "ShowValues" | "ShowDataAs" | "Orientation" | "IncludeTrend" | "IncludeSparkline" | "IncludeMaxAndMin" | "ChartType" | "PlotSeries" | "XAxisLabels" | "XAxisIntersectionAtZero" | "XAxisTitle" | "YAxisTitle" | "MapType" | "Region" | "Continent" | "Country" | "Paging" | "PageSize" | "ShowDataLabelsIn" | "TotalForRows" | "TotalForColumns";

class gxqueryServiceResponse { 
    Errors: [{ Code: number, Message: string }?] 
}
  
class loginResponse extends gxqueryServiceResponse {
    Session: session
}
  
class getMetadataResponse extends gxqueryServiceResponse {
    Metadata: metadata
}
  
class getQueryByNameResponse extends gxqueryServiceResponse {
    Query: query
}
  
class qvMetadataServiceResponse extends gxqueryServiceResponse {
    Metadata: string
}

class qvDataServiceResponse extends gxqueryServiceResponse {
    Data: string
}

export class gxqueryOptions {
    BaseUrl: string
    MetadataName: string;
    QueryName?: string;
    Query?: query;
  }
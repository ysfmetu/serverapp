import { Status } from "../enum/status.enum";

export interface Server {
    id: number;
    ipAddress: string;
    serverName: string;
    detail: string;
    kullanici_adi: string;
    password:string
    categoryName : string;
    status:Status
}
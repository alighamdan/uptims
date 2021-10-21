import axios from 'axios';

class App {

    async get(baseUrl: string){
        let l = (await axios.get(`${baseUrl}`))
        return {
            status: l.status, 
            data: l.data,
            headers: l.headers,
            statusText: l.statusText 
        }
    }
    async post(baseUrl:string, data?:any,options?:any){
        let l = (await axios.post(`${baseUrl}`,data,options));
        return {
            status: l.status,
            data: l.data,
            headers: l.headers,
        }
    }
}


export default new App();
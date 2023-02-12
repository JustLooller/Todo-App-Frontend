import axios, { AxiosResponse } from "axios";

export async function getRequestWithAuthHeader(url: string) {
    const config = {
        headers:{
            Authorization : "Bearer " + localStorage.getItem("jwt")
        },
        params:{
            username: localStorage.getItem("username"),
        }
    }
    try {
        const response = await axios.get(url, config)
        return response;
    } catch (error) {
        console.log(error);
    }

}

export async function postRequestWithAuthHeader(url:string, requestBody:object){
    const config = {
        headers:{
            Authorization : "Bearer " + localStorage.getItem("jwt")
        },
    }
    try {
        const response = await axios.post(url, requestBody, config)
        return response;
    } catch (error) {
        console.log(error);
    }
}

 

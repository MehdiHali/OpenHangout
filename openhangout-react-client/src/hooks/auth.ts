import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { user } from "../types";
import { HOST } from "../config";



function useAuth(){

    let [user,setUser]: [user,Dispatch<SetStateAction<user>>] = useState(null as user);
    let [err,setErr]: [string[],Dispatch<SetStateAction<string[]>>] = useState([] as string[]);


    /**
     * @Note We will always get the privateKey from the state and 
     * from the storage only the first time after a rerender
     * therefore always to set the pk mutations on both the storage
     * and the state
     */
    let [PK,setPK]: [string,Dispatch<SetStateAction<string>>] = useState(localStorage.getItem("privateKey")??"");
    


// axios instance for fetching authenticated resoureces 
const axiosAuth = axios.create({
    baseURL: HOST,
    headers:{
        privateKey: PK
    }
})

//axios instance for fetching unAuthenticated resources
const axiosUnAuth = axios.create({
    baseURL: HOST,
})



    // on privateKey change
    useEffect(()=>{
        getUser();
    },[PK])

    // on rerender 
    useEffect(()=>{
        getUser();
    },[])


    function getSecret(){

    }
    
    function register(){
    }

    function logout(){
        // send req to /logout then remove the private key from the storage

        axiosAuth.post('/logout')
        .then((res: any)=>{
            console.log("LOGOUT SUCCESS:",res.data);
            localStorage.removeItem("privateKey");
            setPK("");
            setUser(null);
        })
    }

    function signup(username: string, password: string){
        let cred = {username:username,password:password};
        let credJson: string = JSON.stringify(cred);
        // send req to /auth then store private key in the storage
        axiosUnAuth.post('/auth',credJson,{headers:{"content-type":"application/json"}})
        .then((res: any)=>{
            console.log("LOGIN SUCCESS",res.data);
            localStorage.setItem('privateKey',res.data)
            // redirect to the chat
            // the chat should call the use auth to get the user
        })
        .catch((err: any)=>{
            console.log("LOGGIN ERR",err.data);
            setErr(err.data);
        })
    }

    function getUser(){
        console.log("making request with key ",PK);
        
            axiosAuth.get(`users/user`)
            .then(res=>{
                console.log("USER: ",res.data);
                let user: user = {username: res.data};
                setUser(user);
            })
            .catch(err=>{
                console.log("ERROR "+err.response.data);
                
            })
    }

    function login(username: string, password: string){
        let cred = {username:username,password:password};
        let credJson: string = JSON.stringify(cred);
        console.log("credentials json",credJson);
        
        // send req to /auth then store private key in the storage
        axiosUnAuth.post("auth",credJson,{
            headers:{"Content-Type": "application/json"}
        })
        .then((res: any)=>{
            let token: string = res.data;
            console.log("LOGIN SUCCESS",token);
            //empty the errors
            setErr([]);
            localStorage.setItem("privateKey",token);

            // 
            setPK(token)
            // getUser();

            // redirect to the chat
            // the chat should call the use auth to get the user
        })
        .catch((err: any)=>{
            console.log("LOGGIN ERR",err.response.data);
            if(err.response.status < 500)
            setErr(["Wrong Credentials"]);
            else
            setErr(["Something Went Wrong"])

            setUser(null);
        })
    }


    return {user,err,login, signup,logout,register,getSecret,PK, axiosAuth, axiosUnAuth};
}


export default useAuth;
import axios from "axios"
const API=axios.create({baseURL:"http://localhost:3001"})

export const getCustomers=()=>API.get("/customers")

export const getStorage = () => API.get("/storage");

export const updateStorage=(name,column,value)=>API.put(`/updateStorage/${name}`,{column,value})

export const addPackets=(name,addPackets)=>API.put(`/updateStorage/${name}/add`,{addPackets})

export const removePackets=(name,addPackets)=>API.put(`/updateStorage/${name}/remove`,{addPackets})

export const addBrand = (brand)=>API.post("/storage/addBrand", brand);
  
export const getAllDetails = () => API.get("/storage/allDetails");

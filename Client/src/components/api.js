import axios from "axios"
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://ricedeployment2.onrender.com/api" 
    : "http://localhost:3000/api";   
const API=axios.create({baseURL,})
API.interceptors.request.use((config) => {
    
  const token = localStorage.getItem("token");
  // console.log("✅ Sending token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

// export const getCustomers=()=>API.get("/customers")

// export const getStorage = () => API.get("/storage");

// export const updateStorage=(name,column,value)=>API.put(`/updateStorage/${name}`,{column,value})

// export const addPackets=(name,addPackets)=>API.put(`/updateStorage/${name}/add`,{addPackets})

// export const removePackets=(name,addPackets)=>API.put(`/updateStorage/${name}/remove`,{addPackets})

// export const addBrand = (brand)=>API.post("/storage/addBrand", brand);
  
// export const getAllDetails = () => API.get("/storage/allDetails");

export const loginUser = (credentials) => API.post("/api/auth/login", credentials);
export const registerUser = (credentials) => API.post("/api/auth/register", credentials);
export default API
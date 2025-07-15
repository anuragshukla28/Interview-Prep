import axios from "./axios.js";

// Register user
export const registerUser = (data) => axios.post("/auth/register", data);

// Login user
export const loginUser = (data) => axios.post("/auth/login", data);

// Get current user (for profile/dashboard)
export const getCurrentUser = () => axios.get("/auth/me");

// Logout user
export const logoutUser = () => axios.post("/auth/logout");
export const addQuestion = (data) => axios.post("/questions", data);


export const getResources = () => axios.get('/resources');
export const addResource = (data) => axios.post("/resources", data);

export const getQuestions = () => axios.get('/questions');
export const getProfile = () => axios.get("/auth/me");

export const markSolved = (id) => axios.post(`/questions/${id}/solve`);
export const unmarkSolved = (id) => axios.post(`/questions/${id}/unsolve`);


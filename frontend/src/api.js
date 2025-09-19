import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const adminUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const userVerify = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/user/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

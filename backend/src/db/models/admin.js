import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // guarda el token usando la acción que creo en el store
            dispatch({ 
                type: "login", 
                payload: { token: data.token, user_id: data.user_id } 
            });
            navigate("/"); // manda a la tienda
        } else {
            alert("Error: " + data.msg);
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h1>Iniciar Sesión</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleLogin} className="card p-4 shadow-sm border-0">
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Contraseña" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                        <p className="mt-3">¿Nuevo aquí? <Link to="/signup">Crea una cuenta</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};



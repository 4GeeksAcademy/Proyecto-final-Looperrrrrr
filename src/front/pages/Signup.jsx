import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert("¡Cuenta creada! Ahora puedes iniciar sesión.");
            navigate("/login");
        } else {
            alert("Error: El usuario ya existe o datos incorrectos");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h1>Únete a ReKicks</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSignup} className="card p-4 shadow-sm border-0">
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Contraseña" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Registrarse</button>
                        <p className="mt-3">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};


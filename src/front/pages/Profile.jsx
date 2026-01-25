import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        if (!store.token) {
            navigate("/login");
            return;
        }
        
        
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/profile", {
                headers: { "Authorization": "Bearer " + store.token }
            });
            const data = await resp.json();
            if (resp.ok) {
                setUserData({ ...userData, email: data.email });
            } else {
                console.error("Error cargando perfil");
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const confirmUpdate = window.confirm("¿Seguro que quieres actualizar tus datos?");
        if (!confirmUpdate) return;

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + store.token
                },
                body: JSON.stringify(userData)
            });
            
            const data = await resp.json();
            if (resp.ok) {
                alert("✅ Datos actualizados correctamente");
                if (userData.password) alert("Has cambiado tu contraseña. Por favor inicia sesión de nuevo.");
            } else {
                alert("❌ Error: " + data.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    
    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm("⚠️ ¿ESTÁS SEGURO? Esto borrará tu cuenta, pedidos y favoritos.");
        if (!confirm1) return;
        
        const confirm2 = window.confirm("⚠️ Esta acción es IRREVERSIBLE. ¿Borrar definitivamente?");
        if (!confirm2) return;

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/profile", {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + store.token }
            });

            if (resp.ok) {
                alert("Cuenta eliminada. Te echaremos de menos. 👋");
                dispatch({ type: "logout" });
                navigate("/");
            } else {
                alert("No se pudo eliminar la cuenta");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">👤 Mi Perfil</h2>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-4">
                        <h4>Editar mis datos</h4>
                        <form onSubmit={handleUpdate} className="mt-3">
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nueva Contraseña (opcional)</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Dejar en blanco para mantener la actual"
                                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </form>
                    </div>
                </div>

                <div className="col-md-6 mt-4 mt-md-0">
                    <div className="card shadow-sm border-0 p-4 border-danger" style={{borderLeft: "5px solid #dc3545"}}>
                        <h4 className="text-danger">⚠️ Zona de Peligro</h4>
                        <p className="text-muted">
                            Si eliminas tu cuenta, perderás todo tu historial de pedidos, carrito y favoritos. 
                            Esta acción no se puede deshacer.
                        </p>
                        <button onClick={handleDeleteAccount} className="btn btn-outline-danger">
                            Eliminar mi cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


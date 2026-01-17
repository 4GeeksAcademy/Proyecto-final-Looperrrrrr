import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Success = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const clearCart = async () => {
            if (store.token) {
                try {
                    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                        method: "DELETE",
                        headers: { "Authorization": "Bearer " + store.token }
                    });
                    dispatch({ type: "set_cart", payload: [] });
                } catch (error) {
                    console.error(error);
                }
            }
        };
        clearCart();
    }, []);

    return (
        <div className="container mt-5 text-center">
            <h1 className="text-success display-4">¡Pago Exitoso! ✅</h1>
            <p className="lead">Gracias por tu compra.</p>
            <Link to="/" className="btn btn-primary mt-3">Seguir Comprando</Link>
        </div>
    );
};
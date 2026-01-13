import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Cart = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);


    useEffect(() => {
        const fetchCart = async () => {
            if (!store.token) return;


            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                    headers: { "Authorization": "Bearer " + store.token }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_cart", payload: data });
                }
            } catch (error) {
                console.error("Error cargando carrito:", error);
            }
        };
        fetchCart();
    }, []);

    // Calculo Total
    useEffect(() => {
        let totalPrice = 0;
        store.cart.forEach(item => {

            if (item.product) {
                totalPrice += item.product.price;
            }
        });
        setTotal(totalPrice);
    }, [store.cart]);


    const removeFromCart = async (cartItemId) => {

        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        if (!confirmDelete) return;

        console.log("Intentando borrar item con ID:", cartItemId);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart/" + cartItemId, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + store.token
                }
            });

            if (response.ok) {
                console.log("Borrado en Backend OK");

                dispatch({ type: "remove_from_cart", payload: cartItemId });

            } else {
                console.error("Error borrando en backend:", response.status);
                alert("Hubo un error al borrar");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    if (!store.token) {
        return (
            <div className="text-center mt-5">
                <h3>Por favor, inicia sesión.</h3>
                <Link to="/login" className="btn btn-primary mt-3">Ir al Login</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">🛒 Tu Carrito</h1>

            <div className="row">
                <div className="col-md-8">
                    {store.cart.length === 0 ? (
                        <div className="alert alert-info">Tu carrito está vacío.</div>
                    ) : (
                        <ul className="list-group shadow-sm">
                            {store.cart.map((item) => (
                                <li key={item.id} className="list-group-item d-flex align-items-center p-3">

                                    {item.product ? (
                                        <>
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                className="rounded me-3"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1">{item.product.name}</h5>
                                                <p className="mb-0 text-muted small">Talla: {item.product.size}</p>
                                            </div>
                                            <div className="text-end">
                                                <p className="fw-bold mb-2">{item.product.price} €</p>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"

                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <i className="fas fa-trash"></i> Eliminar
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-muted">Producto no disponible (ID: {item.id}) - <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-danger">Borrar</button></div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Total</h4>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="h3 fw-bold">{total.toFixed(2)} €</span>
                            </div>
                            <button className="btn btn-dark w-100 btn-lg" disabled={store.cart.length === 0}>
                                Pagar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



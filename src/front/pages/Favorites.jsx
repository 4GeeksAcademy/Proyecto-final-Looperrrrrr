import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
            return;
        }
        const loadFavorites = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorites", {
                    headers: { "Authorization": "Bearer " + store.token }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_favorites", payload: data });
                }
            } catch (error) {
                console.error(error);
            }
        };
        loadFavorites();
    }, []);

    const removeFav = async (favId) => {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/favorites/" + favId, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + store.token }
            });
            if (response.ok) {
                dispatch({ type: "remove_favorite", payload: favId });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-danger mb-4">❤️ Mis Favoritos</h2>
            {store.favorites.length === 0 ? (
                <div className="alert alert-light">No tienes favoritos aún.</div>
            ) : (
                <div className="row">
                    {store.favorites.map((fav) => (
                        <div key={fav.id} className="col-md-3 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                                <Link to={`/product/${fav.product.id}`}>
                                    <img src={fav.product.image_url} className="card-img-top" style={{height:"200px", objectFit:"cover"}} alt={fav.product.name}/>
                                </Link>
                                <div className="card-body">
                                    <h6 className="card-title text-truncate">{fav.product.name}</h6>
                                    <p className="fw-bold">{fav.product.price} €</p>
                                    <button className="btn btn-outline-danger btn-sm w-100" onClick={() => removeFav(fav.id)}>
                                        <i className="fa-solid fa-trash"></i> Quitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
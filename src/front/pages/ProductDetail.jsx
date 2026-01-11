import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ProductDetail = () => {
    const { id } = useParams(); 
    const { store, dispatch } = useGlobalReducer();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const loadSingleProduct = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/products/" + id);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error("Zapatilla no encontrada");
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
            setLoading(false);
        };

        loadSingleProduct();
    }, [id]);

    
    const addToCart = async () => {
        
        const token = localStorage.getItem("token"); 

        if (!token) {
            alert("🔒 Por favor, inicia sesión para comprar.");
            return;
        }
        
        console.log("Enviando Token:", token); 

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token 
                },
                body: JSON.stringify({ product_id: product.id })
            });

            if (response.ok) {
                const data = await response.json();
                alert("✅ ¡Añadido al carrito!");
                dispatch({ type: 'add_to_cart', payload: data.cart_item });
            } else {
                
                const errorData = await response.json(); 
                console.error("Error del servidor:", errorData);
                alert("❌ Error: " + (errorData.msg || "Error desconocido"));
                
                
                if (response.status === 401 || response.status === 422) {
                    dispatch({ type: "logout" }); 
                }
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    
    if (loading) return <div className="text-center mt-5">Loading history...</div>;
    if (!product) return <div className="text-center mt-5">Producto no encontrado :(</div>;

    return (
        <div className="container mt-5">
            
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="card mb-3 border-0 shadow-lg">
                <div className="row g-0">
                    
                    <div className="col-md-6 bg-light d-flex align-items-center justify-content-center">
                        <img 
                            src={product.image_url} 
                            className="img-fluid rounded-start p-4" 
                            alt={product.name} 
                            style={{ maxHeight: "500px", objectFit: "contain" }}
                        />
                    </div>
                    
                    
                    <div className="col-md-6 p-4">
                        <div className="card-body">
                            
                            
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className={`badge ${product.condition.includes("Nueva") ? "bg-success" : "bg-warning text-dark"} fs-6`}>
                                    {product.condition}
                                </span>
                                <h2 className="text-primary fw-bold mb-0">{product.price} €</h2>
                            </div>

                            <h1 className="card-title fw-bold mb-3">{product.name}</h1>
                            
                            
                            <p className="card-text fs-5 text-muted">{product.description}</p>
                            
                            <hr className="my-4" />

                            <div className="row mb-4">
                                <div className="col-6">
                                    <p className="small text-uppercase text-muted mb-1">Talla Única</p>
                                    <p className="fs-4 fw-bold">{product.size} EU</p>
                                </div>
                                <div className="col-6">
                                    <p className="small text-uppercase text-muted mb-1">Caja Original</p>
                                    <p className="fs-4 fw-bold">{product.original_box ? "✅ Sí" : "❌ No"}</p>
                                </div>
                            </div>

                            
                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-dark btn-lg"
                                    onClick={addToCart} 
                                >
                                    Añadir al Carrito 🛒
                                </button>
                                <button className="btn btn-outline-secondary">
                                    Guardar en Favoritos ❤️
                                </button>
                            </div>
                            
                            <div className="mt-3 text-center">
                                <small className="text-success fw-bold">
                                    <i className="fas fa-check-circle me-1"></i>
                                    Autenticidad Verificada por ReKicks™
                                </small>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


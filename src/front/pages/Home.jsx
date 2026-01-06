import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  
  const loadProducts = async () => {
    try {
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        if (!backendUrl) throw new Error("VITE_BACKEND_URL no está definida");

        
        const response = await fetch(backendUrl + "/api/products");
        const data = await response.json();

        
        if (response.ok) {
            dispatch({ type: "set_products", payload: data });
        }
    } catch (error) {
        console.error("Error cargando zapatillas:", error);
    }
  };

  
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">ReKicks</h1>
        <p className="lead text-muted">No compres nuevo. Compra historia.</p>
      </div>

      <div className="row">
        
        {store.products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              
              <img 
                src={product.image_url} 
                className="card-img-top" 
                alt={product.name}
                style={{ height: "250px", objectFit: "cover" }} 
              />
              
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary">{product.condition}</span>
                    <span className="text-primary fw-bold fs-5">{product.price} €</span>
                </div>
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                
                <div className="d-grid gap-2">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-dark">
                        Ver Detalles
                    </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {store.products.length === 0 && (
        <div className="text-center text-muted mt-5">
            <p>Cargando catálogo o no hay stock disponible...</p>
        </div>
      )}
    </div>
  );
};


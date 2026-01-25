import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect } from "react";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token && store.cart.length === 0) {
            const fetchCart = async () => {
                try {
                    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/cart", {
                        headers: {
                            "Authorization": "Bearer " + store.token
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        dispatch({ type: "set_cart", payload: data });
                    }
                } catch (error) {
                    console.error("Error sincronizando carrito:", error);
                }
            };
            fetchCart();
        }
    }, [store.token]);

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/");
    }; 
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">
                    ReKicks 👟
                </Link>
                <div className="ml-auto d-flex align-items-center">
                    {!store.token ? (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-primary me-2">Log in</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-primary">Sign up</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/favorites">
                                <button className="btn btn-outline-danger me-2">
                                    <i className="fa-regular fa-heart"></i> Favoritos
                                </button>
                            </Link>

                            <Link to="/cart">
                                <button className="btn btn-outline-success me-3 position-relative">
                                    <i className="fa-solid fa-cart-shopping"></i> Carrito
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {store.cart.length}
                                    </span>
                                </button>
                            </Link>

                            <Link to="/profile">
                                <button className="btn btn-outline-primary me-2">
                                    <i className="fa-solid fa-user"></i> Perfil
                                </button>
                            </Link>

                            <button onClick={handleLogout} className="btn btn-danger">
                                Log out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link to="/" className="navbar-brand fw-bold fs-3 text-primary">
                    ReKicks 👟
                </Link>
                
                <div className="ml-auto d-flex align-items-center">
                    
                    { !store.token ? (
                        
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
                            <button className="btn btn-outline-success me-3">
                                🛒 Carrito 
                                <span className="badge bg-success ms-1">{store.cart.length}</span>
                            </button>
                            
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




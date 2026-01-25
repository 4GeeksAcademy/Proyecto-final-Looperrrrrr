import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5">
            <div className="container text-center text-md-start">
                <div className="row text-center text-md-start">
                    
                    
                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 fw-bold text-primary">
                            ReKicks 👟
                        </h5>
                        <p>
                            La plataforma líder para comprar y vender zapatillas exclusivas. 
                            Autenticidad garantizada en cada paso.
                        </p>
                    </div>

                    

                    
                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 fw-bold">Contacto</h5>
                        <p>
                            <i className="fas fa-home me-3"></i> Madrid, España
                        </p>
                        <p>
                            <i className="fas fa-envelope me-3"></i> info@rekicks.com
                        </p>
                        <p>
                            <i className="fas fa-phone me-3"></i> +34 91 123 45 67
                        </p>
                    </div>
                </div>

                <hr className="mb-4" />

                
                <div className="row align-items-center">
                    <div className="col-md-7 col-lg-8">
                        <p>
                            © {new Date().getFullYear()} <strong>ReKicks</strong>. Todos los derechos reservados.
                        </p>
                    </div>

                    <div className="col-md-5 col-lg-4">
                        <div className="text-center text-md-end">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-light" style={{ fontSize: "20px" }}>
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-light" style={{ fontSize: "20px" }}>
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-light" style={{ fontSize: "20px" }}>
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
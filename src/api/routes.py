"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import stripe
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Cart, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)
CORS(api)


stripe.api_key = os.getenv("STRIPE_API_KEY")

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = { "message": "Backend conectado y funcionando 🚀" }
    return jsonify(response_body), 200


# AUTENTICACIÓN Y USUARIOS 


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    if 'email' not in body or 'password' not in body:
        return jsonify({"msg": "Faltan datos (email o password)"}), 400

    existing_user = User.query.filter_by(email=body['email']).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    hashed_password = generate_password_hash(body['password'])
    
    new_user = User(email=body['email'], password=hashed_password, is_active=True)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Usuario creado con éxito"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if 'email' not in body or 'password' not in body:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(email=body['email']).first()

    if user and check_password_hash(user.password, body['password']):
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"token": access_token, "user_id": user.id, "email": user.email}), 200
    
    return jsonify({"msg": "Email o contraseña incorrectos"}), 401


@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    return jsonify(user.serialize()), 200


@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    body = request.get_json()

    
    if 'email' in body and body['email']:
        
        existing = User.query.filter_by(email=body['email']).first()
        if existing and existing.id != current_user_id:
            return jsonify({"msg": "Ese email ya está en uso"}), 400
        user.email = body['email']
    
   
    if 'password' in body and body['password']:
        user.password = generate_password_hash(body['password'])

    db.session.commit()
    return jsonify({"msg": "Datos actualizados correctamente", "user": user.serialize()}), 200


@api.route('/user/profile', methods=['DELETE'])
@jwt_required()
def delete_user_account():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    
    Cart.query.filter_by(user_id=current_user_id).delete()
    Favorite.query.filter_by(user_id=current_user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Cuenta eliminada permanentemente"}), 200



# PRODUCTOS Y CATÁLOGO


@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    results = list(map(lambda item: item.serialize(), products))
    return jsonify(results), 200

@api.route('/products/<int:product_id>', methods=['GET'])
def get_single_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200



# CARRITO DE COMPRAS


@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user_id = int(get_jwt_identity())
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    results = list(map(lambda item: item.serialize(), cart_items))
    return jsonify(results), 200

@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    current_user_id = int(get_jwt_identity())
    body = request.get_json()
    
    if 'product_id' not in body:
        return jsonify({"msg": "Falta el product_id"}), 400

    product = Product.query.get(body['product_id'])
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    new_item = Cart(user_id=current_user_id, product_id=body['product_id'])
    db.session.add(new_item)
    db.session.commit()
    
    db.session.refresh(new_item)

    return jsonify({"msg": "Añadido al carrito", "cart_item": new_item.serialize()}), 201

@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    current_user_id = int(get_jwt_identity())
    item = Cart.query.get(item_id)
    
    if not item: return jsonify({"msg": "Item no encontrado"}), 404
    if item.user_id != current_user_id: return jsonify({"msg": "Sin permiso"}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Eliminado del carrito"}), 200

@api.route('/cart', methods=['DELETE'])
@jwt_required()
def delete_cart_all():
    current_user_id = int(get_jwt_identity())
    Cart.query.filter_by(user_id=current_user_id).delete()
    db.session.commit()
    return jsonify({"msg": "Carrito vaciado"}), 200



#  FAVORITOS


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = int(get_jwt_identity())
    favorites = Favorite.query.filter_by(user_id=current_user_id).all()
    results = list(map(lambda item: item.serialize(), favorites))
    return jsonify(results), 200

@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    current_user_id = int(get_jwt_identity())
    body = request.get_json()
    
    if 'product_id' not in body: return jsonify({"msg": "Falta el product_id"}), 400

    
    existing = Favorite.query.filter_by(user_id=current_user_id, product_id=body['product_id']).first()
    if existing: return jsonify({"msg": "Ya está en favoritos"}), 400

    new_fav = Favorite(user_id=current_user_id, product_id=body['product_id'])
    db.session.add(new_fav)
    db.session.commit()
    
    return jsonify({"msg": "Añadido a favoritos", "favorite": new_fav.serialize()}), 201

@api.route('/favorites/<int:fav_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(fav_id):
    current_user_id = int(get_jwt_identity())
    fav = Favorite.query.get(fav_id)
    
    if not fav: return jsonify({"msg": "No encontrado"}), 404
    if fav.user_id != current_user_id: return jsonify({"msg": "Sin permiso"}), 403

    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg": "Eliminado de favoritos"}), 200



#  PASARELA DE PAGO 


@api.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    current_user_id = int(get_jwt_identity())
    cart_items = Cart.query.filter_by(user_id=current_user_id).all()
    
    if not cart_items:
        return jsonify({"msg": "El carrito está vacío"}), 400

    line_items = []
    for item in cart_items:
        line_items.append({
            'price_data': {
                'currency': 'eur',
                'product_data': {
                    'name': item.product.name,
                },
                'unit_amount': int(item.product.price * 100), # Centimos
            },
            'quantity': 1,
        })

    frontend_url = os.getenv("FRONTEND_URL")
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=frontend_url + '/success',
            cancel_url=frontend_url + '/cart',
        )
        return jsonify({"url": checkout_session.url})
    except Exception as e:
        return jsonify({"msg": str(e)}), 500



#  SEMBRADOR DE DATOS 


@api.route('/populate', methods=['GET'])
def populate_db():
    try:
        
        db.session.query(Cart).delete()
        db.session.query(Favorite).delete()
        
        
        db.session.query(Product).delete()
        
       
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error limpiando base de datos", "error": str(e)}), 500

    
    products = [
        {
            "name": "Nike Air Jordan 1 High Chicago", 
            "description": "El clásico de 1985. Cuero premium, una joya del baloncesto.", 
            "price": 350.00, 
            "image_url": "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=600&q=80", 
            "size": 43, 
            "condition": "Como nueva", 
            "original_box": True
        },
        {
            "name": "Adidas Yeezy Boost 350 V2", 
            "description": "Comodidad extrema con tecnología Boost. Color Zebra.", 
            "price": 220.50, 
            "image_url": "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=600&q=80", 
            "size": 41, 
            "condition": "Buena", 
            "original_box": True
        },
        {
            "name": "New Balance 550 Green", 
            "description": "Estilo retro baloncesto que combina con todo.", 
            "price": 95.00, 
            "image_url": "https://images.unsplash.com/photo-1663935665668-35613348882e?auto=format&fit=crop&w=600&q=80", 
            "size": 42, 
            "condition": "Muy buena", 
            "original_box": False
        },
        {
            "name": "Nike Dunk Low Panda", 
            "description": "Blanco y negro. Las zapatillas más buscadas del año.", 
            "price": 110.00, 
            "image_url": "https://images.unsplash.com/photo-1636565138194-e0b2302008fb?auto=format&fit=crop&w=600&q=80", 
            "size": 40, 
            "condition": "Como nueva", 
            "original_box": True
        },
        {
            "name": "Vans Old Skool Pro", 
            "description": "Suela reforzada para skate. Durabilidad máxima.", 
            "price": 35.00, 
            "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80", 
            "size": 44, 
            "condition": "Usada", 
            "original_box": False
        },
        {
            "name": "Reebok Club C 85 Vintage", 
            "description": "Cuero suave color crema. Elegancia atemporal.", 
            "price": 60.00, 
            "image_url": "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?auto=format&fit=crop&w=600&q=80", 
            "size": 38, 
            "condition": "Muy buena", 
            "original_box": True
        },
        {
            "name": "Puma Suede Classic", 
            "description": "Rojas. Un icono de la cultura hip-hop.", 
            "price": 50.00, 
            "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80", 
            "size": 42, 
            "condition": "Nueva", 
            "original_box": True
        },
        {
            "name": "Converse Chuck 70 High", 
            "description": "Negras clásicas con lona más resistente.", 
            "price": 45.00, 
            "image_url": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80", 
            "size": 39, 
            "condition": "Aceptable", 
            "original_box": False
        }
    ]

    for p in products:
        new_p = Product(
            name=p['name'],
            description=p['description'],
            price=p['price'],
            image_url=p['image_url'],
            size=p['size'],
            condition=p['condition'],
            original_box=p['original_box'],
            is_sold=False
        )
        db.session.add(new_p)
    
    db.session.commit()
    return jsonify({"msg": "Base de datos renovada con fotos HD"}), 200
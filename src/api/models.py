from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    
    # los favoritos de usuario
    favorites = db.relationship('Favorite', backref='user', lazy=True)
    # para ver lo que hay en el carrito
    cart_items = db.relationship('Cart', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            
        }


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    
    
    size = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(50), nullable=False)
    original_box = db.Column(db.Boolean(), default=True)
    is_sold = db.Column(db.Boolean(), default=False) 

    def __repr__(self):
        return f'<Product {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "size": self.size,
            "condition": self.condition,
            "original_box": self.original_box,
            "is_sold": self.is_sold
        }

# tabla de favoritos
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)

    # acceder a los datos del producto desde el favorito
    product = db.relationship('Product')

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product": self.product.serialize()
        }

# carrito
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    
    product = db.relationship('Product')

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product": self.product.serialize()
        }
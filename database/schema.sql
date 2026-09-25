CREATE TABLE customers(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_customers_email_lower
ON customers(LOWER(email));


CREATE TABLE addresses(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER NOT NULL
        CONSTRAINT addresses_customer_fk
            REFERENCES customers(id)
                ON DELETE CASCADE,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(50) NOT NULL,
    house_number VARCHAR(20) NOT NULL,
    apartment_number INTEGER,
    postal_code TEXT NOT NULL,
    country VARCHAR(50) NOT NULL
);


CREATE TABLE categories(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE products(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL
        CONSTRAINT products_price_check
            CHECK (price > 0),
    category_id INTEGER NOT NULL
        CONSTRAINT products_category_id_fk
            REFERENCES categories(id)
                ON DELETE RESTRICT
);


CREATE TABLE sizes(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(5) UNIQUE NOT NULL
);


CREATE TABLE product_sizes(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL
        CONSTRAINT product_sizes_product_fk
            REFERENCES products(id)
                ON DELETE CASCADE,
    size_id INTEGER NOT NULL
        CONSTRAINT product_sizes_size_fk
            REFERENCES sizes(id)
                ON DELETE RESTRICT,
    stock INTEGER NOT NULL DEFAULT 0
        CONSTRAINT product_sizes_stock_check
            CHECK (stock >= 0),
    wishlist_count INTEGER NOT NULL DEFAULT 0
        CONSTRAINT product_sizes_wishlist_count_check
            CHECK (wishlist_count >= 0),

        CONSTRAINT product_sizes_unique_product_size
            UNIQUE (product_id, size_id)
);


CREATE TABLE product_images(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL
        CONSTRAINT product_images_product_fk
            REFERENCES products(id)
                ON DELETE CASCADE,
    image TEXT NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE UNIQUE INDEX idx_product_images_is_main
    ON product_images(product_id)
    WHERE is_main = TRUE;


CREATE TABLE orders(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER
        CONSTRAINT orders_customer_fk
            REFERENCES customers(id)
                ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL
        CONSTRAINT orders_status_check DEFAULT 'pending'
            CHECK (status = 'pending'
                OR status = 'paid'
                OR status = 'shipped'
                OR status = 'delivered'
                OR status = 'cancelled'
                OR status = 'expired')
);


CREATE TABLE order_items(
    order_id INTEGER NOT NULL,
    product_size_id INTEGER NOT NULL
        CONSTRAINT order_items_product_size_fk
            REFERENCES product_sizes(id)
            ON DELETE RESTRICT,
    quantity INTEGER NOT NULL
        CONSTRAINT orders_quantity_check
            CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL
        CONSTRAINT order_items_order_price_check
            CHECK (price > 0),

        CONSTRAINT order_items_order_fk
            PRIMARY KEY (order_id, product_size_id),

        CONSTRAINT order_items_fk
            FOREIGN KEY (order_id)
                REFERENCES orders(id)
                    ON DELETE CASCADE
);


CREATE TABLE order_addresses(
    order_id INTEGER NOT NULL PRIMARY KEY
        CONSTRAINT order_addresses_order_fk
            REFERENCES orders(id)
                ON DELETE CASCADE,
    city VARCHAR(50) NOT NULL,
    street VARCHAR(50) NOT NULL,
    house_number VARCHAR(20) NOT NULL,
    apartment_number INTEGER,
    postal_code TEXT NOT NULL,
    country VARCHAR(50) NOT NULL
);


CREATE TABLE discounts(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    percent INTEGER NOT NULL
        CONSTRAINT discounts_percent_check
            CHECK (percent > 0 AND percent <= 100),
    starts_at DATE NOT NULL ,
    ends_at DATE NOT NULL ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

        CONSTRAINT discounts_period_check
            CHECK (ends_at >= starts_at)
);


CREATE TABLE promo_codes(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    percent INTEGER NOT NULL
        CONSTRAINT promo_percent_check
            CHECK (percent > 0 AND percent <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at DATE NOT NULL,
    ends_at DATE NOT NULL,
    max_usages INTEGER DEFAULT NULL
        CONSTRAINT promo_codes_max_usages_check
            CHECK (max_usages IS NULL OR max_usages > 0),

        CONSTRAINT promo_codes_terms_check
            CHECK (ends_at >= starts_at)
);


CREATE TABLE promo_code_usages(
    promo_code_id INTEGER NOT NULL
        CONSTRAINT promo_code_usages_promo_id
            REFERENCES promo_codes(id)
                ON DELETE RESTRICT,
    order_id INTEGER NOT NULL
        CONSTRAINT promo_code_usages_order_id
            REFERENCES orders(id)
                ON DELETE CASCADE ,
    customer_id INTEGER
        CONSTRAINT promo_code_usages_customer_id
            REFERENCES customers(id)
                ON DELETE SET NULL,
    name TEXT NOT NULL,
    percent INTEGER NOT NULL,
    used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT promo_code_usages_order_promo
            UNIQUE (order_id),

        CONSTRAINT promo_code_usages_customer_promo
            UNIQUE (promo_code_id, customer_id)
);


CREATE TABLE discount_products(
    product_id INTEGER NOT NULL
        CONSTRAINT discount_products_product_fk
            REFERENCES products(id)
                ON DELETE CASCADE,
    discount_id INTEGER NOT NULL
        CONSTRAINT discount_products_discount_fk
            REFERENCES discounts(id)
            ON DELETE CASCADE,

        CONSTRAINT discount_products_pk
            PRIMARY KEY (product_id, discount_id)
);


CREATE TABLE reviews(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER
        CONSTRAINT reviews_customer_fk
            REFERENCES customers(id)
                ON DELETE SET NULL,
    product_id INTEGER NOT NULL
        CONSTRAINT reviews_product_fk
            REFERENCES products(id)
                ON DELETE CASCADE,
    review_text TEXT,
    rating SMALLINT NOT NULL
        CONSTRAINT reviews_rating_check
            CHECK (rating > 0 AND rating <= 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT reviews_unique_customer_product
            UNIQUE (customer_id, product_id)
);


CREATE TABLE wishlist(
    customer_id INTEGER NOT NULL
        CONSTRAINT wishlist_customer_fk
            REFERENCES customers(id)
                ON DELETE CASCADE,
    product_size_id INTEGER NOT NULL
        CONSTRAINT wishlist_product_size_fk
            REFERENCES product_sizes(id)
                ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT wishlist_pk
            PRIMARY KEY (customer_id, product_size_id)
);

CREATE INDEX idx_wishlist_product_size_id
ON wishlist(product_size_id);

CREATE INDEX idx_wishlist_customer_created_at
ON wishlist(customer_id, created_at DESC);

CREATE OR REPLACE FUNCTION increment_wishlist_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    BEGIN
        UPDATE product_sizes
        SET wishlist_count = wishlist_count + 1
        WHERE id = NEW.product_size_id;

        RETURN NEW;
    end;
    $$;

CREATE TRIGGER increment_wishlist_count
    AFTER INSERT ON wishlist
    FOR EACH ROW
EXECUTE FUNCTION increment_wishlist_count();


CREATE OR REPLACE FUNCTION decrement_wishlist_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    BEGIN
        UPDATE product_sizes
        SET wishlist_count = wishlist_count - 1
        WHERE id = OLD.product_size_id;

        RETURN OLD;
    end;
    $$;

CREATE TRIGGER decrement_wishlist_count
AFTER DELETE ON wishlist
FOR EACH ROW
EXECUTE FUNCTION decrement_wishlist_count();


CREATE TABLE cart_items(
    customer_id INTEGER NOT NULL
        CONSTRAINT cart_items_customer_fk
            REFERENCES customers(id)
                ON DELETE CASCADE,
    product_size_id INTEGER NOT NULL
        CONSTRAINT cart_items_product_size_fk
            REFERENCES product_sizes(id)
                ON DELETE CASCADE,
    quantity INTEGER NOT NULL
        CONSTRAINT cart_items_quantity_check
            CHECK (quantity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT cart_items_customer_product_size_pk
            PRIMARY KEY (customer_id, product_size_id)
);

CREATE INDEX idx_cart_items_product_size
    ON cart_items(product_size_id);


-- Example: Add product to cart.
-- If the product already exists in the cart, increase its quantity.
-- ______________________________________________________________
-- INSERT INTO cart_items(customer_id, product_size_id, quantity)
-- VALUES (1, 1, 1)
-- ON CONFLICT (customer_id, product_size_id)
-- DO UPDATE SET
--               quantity = cart_items.quantity + EXCLUDED.quantity;


CREATE TABLE payments(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INTEGER NOT NULL
        CONSTRAINT payments_order_fk
            REFERENCES orders(id)
                ON DELETE RESTRICT,
    provider_transaction_id TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL
        CONSTRAINT payments_amount_check
            CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CONSTRAINT payments_status_check
            CHECK (status = 'pending'
                OR status = 'processing'
                OR status = 'failed'
                OR status = 'succeeded'
                OR status = 'refunded'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);






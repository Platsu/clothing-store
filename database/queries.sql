INSERT INTO categories(name)
VALUES ('T-Shirt');

SELECT *
FROM categories
WHERE id = 1;

SELECT current_database();

SELECT current_database(), current_user;

SELECT id, name
FROM products
ORDER BY id;

INSERT INTO categories (name)
VALUES
    ('T-Shirts'),
    ('Hoodies'),
    ('Jackets'),
    ('Pants'),
    ('Accessories');


INSERT INTO products (name, description, price, category_id)
VALUES
    -- T-Shirts (category_id = 1)
    ('Essential White Tee', 'Classic white cotton t-shirt.', 350.00, 1),
    ('Essential Black Tee', 'Classic black cotton t-shirt.', 350.00, 1),
    ('Oversized Graphic Tee', 'Oversized t-shirt with graphic print.', 650.00, 1),
    ('Premium Heavy Tee', 'Heavyweight premium cotton t-shirt.', 850.00, 1),

    -- Hoodies (category_id = 2)
    ('Basic Hoodie', 'Minimal everyday hoodie.', 1200.00, 2),
    ('Oversized Hoodie', 'Relaxed oversized hoodie.', 1450.00, 2),
    ('Zip Hoodie', 'Full zip hoodie.', 1650.00, 2),
    ('Fleece Hoodie', 'Warm fleece-lined hoodie.', 2100.00, 2),

    -- Jackets (category_id = 3)
    ('Denim Jacket', 'Classic blue denim jacket.', 2300.00, 3),
    ('Bomber Jacket', 'Lightweight bomber jacket.', 2800.00, 3),
    ('Puffer Jacket', 'Winter insulated puffer jacket.', 4200.00, 3),

    -- Pants (category_id = 4)
    ('Cargo Pants', 'Loose fit cargo pants.', 1800.00, 4),
    ('Joggers', 'Comfortable everyday joggers.', 1300.00, 4),
    ('Wide Leg Jeans', 'Wide fit denim jeans.', 2500.00, 4),

    -- Accessories (category_id = 5)
    ('Logo Cap', 'Adjustable baseball cap.', 500.00, 5),
    ('Canvas Tote Bag', 'Minimal branded tote bag.', 700.00, 5),
    ('Beanie', 'Warm knit beanie.', 450.00, 5);
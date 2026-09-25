import pool from "../db/pool.js";

async function getProductById(id) {
    const result = await pool.query(
        `SELECT * 
        FROM products 
        WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}


async function getProducts(filters) {
    const conditions = [];
    const params = [];
    const sortColumns = {
        id: "products.id",
        name: "products.name",
        price: "products.price",
        categoryId: "products.category_id"
    }
    if(filters.categoryId !== undefined) {
        conditions.push(`category_id = $${params.length + 1}`);
        params.push(filters.categoryId);
    }
    if(filters.minPrice !== undefined) {
        conditions.push(`price >= $${params.length + 1}`);
        params.push(filters.minPrice);
    }
    if(filters.maxPrice !== undefined) {
        conditions.push(`price <= $${params.length + 1}`);
        params.push(filters.maxPrice);
    }
    if(filters.search !== undefined) {
        const searchPlaceholder = params.length + 1;
        params.push(`%${filters.search}%`);
        conditions.push(`(products.name ILIKE $${searchPlaceholder} OR products.description ILIKE $${searchPlaceholder})`);
    }

    let where = "";
    if(conditions.length > 0) {
        where = `WHERE ${conditions.join(" AND ")}`
    }

    const limitPlaceholder = params.length + 1;
    const offsetPlaceholder = params.length + 2;

    params.push(filters.limit);
    params.push(filters.offset);

        const result = await pool.query(
            `SELECT * 
        FROM products 
        ${where} 
        ORDER BY ${sortColumns[filters.sortBy]} ${filters.order}
        LIMIT $${limitPlaceholder} 
        OFFSET $${offsetPlaceholder}`,
            params
        );
    return result.rows;
}


async function countProducts(filters){
    const conditions = [];
    const params = [];
    if(filters.categoryId !== undefined) {
        conditions.push(`category_id = $${params.length + 1}`);
        params.push(filters.categoryId);
    }
    if(filters.minPrice !== undefined) {
        conditions.push(`price >= $${params.length + 1}`);
        params.push(filters.minPrice);
    }
    if(filters.maxPrice !== undefined) {
        conditions.push(`price <= $${params.length + 1}`);
        params.push(filters.maxPrice);
    }
    if(filters.search !== undefined) {
        const searchPlaceholder = params.length + 1;
        params.push(`%${filters.search}%`);
        conditions.push(`(products.name ILIKE $${searchPlaceholder} OR products.description ILIKE $${searchPlaceholder})`);
    }

    let where = "";
    if(conditions.length > 0) {
        where = `WHERE ${conditions.join(" AND ")}`
    }

    const result = await pool.query(
        `SELECT COUNT(*) 
        FROM products 
        ${where}`,
        params
    );

    return Number(result.rows[0].count);
}


async function createProduct(product) {
    const result = await pool.query(
        `INSERT INTO products (name, description, price, category_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [product.name, product.description, product.price, product.category_id]
    );
    return result.rows[0];
}


async function updateProduct(updates, id) {
    const allowedFields = ["name", "description", "price", "category_id"];
    const entries = Object.entries(updates)
        .filter(([key]) => allowedFields.includes(key))
    const fields = entries
    .map(([key], index) => `${key} = $${index + 1}`)
        .join(", ");
    const values = entries.map(([, value]) => value);
    values.push(id);

    const result = await pool.query(
        `UPDATE products
        SET ${fields}
        WHERE id = $${values.length}
        RETURNING *`,
        values);

    return result.rows[0];
}


async function replaceProduct(product, id) {
    const replacement = [product.name, product.description, product.price, product.category_id, id];
    const result = await pool.query(
        `UPDATE products
        SET name = $1,
        description = $2,
        price = $3,
        category_id = $4 
        WHERE id = $5
        RETURNING *`,
        replacement);

    return result.rows[0];
}


async function deleteProduct(id) {
    const result = await pool.query(
        `DELETE FROM products
        WHERE id = $1
        RETURNING *`, [id]);

    return result.rows[0];
}


export {
    getProductById,
    getProducts,
    createProduct,
    countProducts,
    updateProduct,
    replaceProduct,
    deleteProduct
};
import pool from "../db/pool.js";

async function getCategoryById(id) {
    const result = await pool.query(
        `SELECT id 
        FROM categories 
        WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

export {getCategoryById};
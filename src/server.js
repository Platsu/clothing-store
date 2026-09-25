import app from "./app.js";
import pool from "./db/pool.js";

const PORT = 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });
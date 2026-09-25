import express from "express";
import * as productController from "../controllers/product.controller.js";
import {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId,
    validateReplaceProduct,
    validateProductQueryParams
}
    from "../middleware/product.validation.middleware.js";

const router = express.Router();
router.get("/:id", validateProductId, productController.getProductById);

router.post("/", validateCreateProduct, productController.createProduct);

router.get("/", validateProductQueryParams, productController.getProducts);

router.patch("/:id", validateProductId, validateUpdateProduct, productController.updateProduct);

router.put("/:id", validateProductId, validateReplaceProduct, productController.replaceProduct);

router.delete("/:id", validateProductId, productController.deleteProduct);

export default router;
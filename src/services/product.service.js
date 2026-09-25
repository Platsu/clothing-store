import * as productRepository from "../repositories/product.repository.js";
import * as categoryRepository from "../repositories/category.repository.js";
import * as errors from "../utils/errors.js";

async function getProductById(id) {
    const product = await productRepository.getProductById(id);
    if(product === undefined) {        //(!product)
        throw new errors.NotFoundError(
            "Product not found",
            "PRODUCT_NOT_FOUND");
    }
    return product;
}


async function getProducts(filters) {
    if(filters.sortBy === undefined) {
        filters.sortBy = "id";
    }
    if(filters.order === undefined) {
        filters.order = "asc";
    }
    if (filters.limit === undefined) {
        filters.limit = 20;
    }
    if (filters.limit > 100) {
        filters.limit = 100;
    }
    if (!filters.offset) {
        filters.offset = 0;
    }
    const [products, total] = await Promise.all([
        productRepository.getProducts(filters),
        productRepository.countProducts(filters)]);
    return {
        items: products,
        pagination: {
            limit: filters.limit,
            offset: filters.offset,
            page: Math.floor(filters.offset / filters.limit) + 1,
            total: total,
            totalPages: Math.ceil(total / filters.limit)
        }
    };
}


async function createProduct(product) {
    if(product.price <= 0) {
        throw new errors.BadRequestError(
            "Price should be greater than 0",
            "PRODUCT_INVALID_PRICE");
    }
    const category = await categoryRepository.getCategoryById(product.category_id);
    if(!category) {
        throw new errors.NotFoundError(
            "Category not found",
            "CATEGORY_NOT_FOUND");
    }
    return productRepository.createProduct(product);
}


async function updateProduct(product, id) {
    if (product.price !== undefined) {
        if (product.price <= 0) {
            throw new errors.BadRequestError(
                "Price should be greater than 0",
                "PRODUCT_INVALID_PRICE"
            )
        }
    }
    if (product.category_id !== undefined) {
        const category = await categoryRepository.getCategoryById(product.category_id);
        if (!category) {
            throw new errors.NotFoundError(
                "Category not found",
                "CATEGORY_NOT_FOUND");
        }
    }
    const updatedProduct = await productRepository.updateProduct(product, id);
    if (!updatedProduct) {
        throw new errors.NotFoundError(
            "Product not found",
            "PRODUCT_NOT_FOUND"
        );
    }
    return updatedProduct;
}


async function replaceProduct(product, id) {
    if(product.price <= 0) {
        throw new errors.BadRequestError(
            "Price should be greater than 0",
            "PRODUCT_INVALID_PRICE"
        );
    }
    const category = await categoryRepository.getCategoryById(product.category_id);
    if (!category) {
        throw new errors.NotFoundError(
            "Category not found",
            "CATEGORY_NOT_FOUND"
        );
    }
    const replacedProduct = await productRepository.replaceProduct(product, id);
    if (!replacedProduct) {
        throw new errors.NotFoundError(
            "Product not found",
            "PRODUCT_NOT_FOUND"
        );
    }
    return replacedProduct;
}


async function deleteProduct(id) {
    const deletedProduct = await productRepository.deleteProduct(id);
    if (deletedProduct === undefined) {
        throw new errors.NotFoundError(
            "Product not found",
            "PRODUCT_NOT_FOUND"
        );
    }
    return deletedProduct;
}


export {
    getProductById,
    getProducts,
    createProduct,
    updateProduct,
    replaceProduct,
    deleteProduct
};
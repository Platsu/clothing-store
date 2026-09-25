import * as productService from "../services/product.service.js";
import * as productDTO from "../dto/product.dto.js";

async function getProductById (req, res, next) {
    try{
        const product = await productService
            .getProductById(req.productId);
        const responseDTO = productDTO.toProductResponseDTO(product);
        res.status(200).json(responseDTO);
    } catch (error) {
        next(error);
    }
}


async function getProducts (req, res, next) {
    try{
        const products = await productService
            .getProducts(req.filters);
        const responseDTO = {
            items: products.items.map(product =>
                productDTO.toProductResponseDTO(product)),
            pagination: products.pagination
        };
        res.status(200).json(responseDTO);
    } catch (error) {
        next(error);
    }
}


async function createProduct (req, res, next) {
    try{
        const createProductDTO = productDTO.toCreateProductDTO(req.body);
        const product = await productService
            .createProduct(createProductDTO);
        const responseDTO = productDTO.toProductResponseDTO(product);
        res.status(201).json(responseDTO);
    } catch (error) {
        next(error);
    }
}


async function updateProduct (req, res, next) {
    try {
        const updateProductDTO = productDTO.toUpdateProductDTO(req.body);
        const updatedProduct = await productService
            .updateProduct(updateProductDTO, req.productId);
        const responseProductDTO = productDTO.toProductResponseDTO(updatedProduct);
        res.status(200).json(responseProductDTO);
    } catch (error) {
        next(error);
    }
}


async function replaceProduct (req, res, next) {
    try {
        const replaceProductDTO = productDTO.toCreateProductDTO(req.body);
        const product = await productService
            .replaceProduct(replaceProductDTO, req.productId);
        const responseProductDTO = productDTO.toProductResponseDTO(product);
        res.status(200).json(responseProductDTO);
    } catch (error) {
        next(error);
    }
}


async function deleteProduct (req, res, next) {
    try {
        await productService
            .deleteProduct(req.productId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}


export
{   createProduct,
    getProductById,
    getProducts,
    updateProduct,
    replaceProduct,
    deleteProduct
};
import { BadRequestError } from "../utils/errors.js";
import * as errors from "../utils/errors.js";

function validateCreateProduct(req, res, next) {
    if(req.body.name === null ||
        req.body.name === undefined ||
        typeof req.body.name !== "string" ||
        req.body.name.trim() === "") {
        return next(
            new BadRequestError(
                "Name is required",
                "PRODUCT_NAME_REQUIRED"
            ));
    }
    if(req.body.price === null ||
        req.body.price === undefined ||
        typeof req.body.price !== "number") {
        return next(
            new BadRequestError(
                "Incorrect price",
                "PRODUCT_INVALID_PRICE"
            ));
    }
    if(req.body.categoryId === null ||
        req.body.categoryId === undefined ||
        typeof req.body.categoryId !== "number") {
        return next(
            new BadRequestError(
                "Incorrect categoryId",
                "PRODUCT_INVALID_CATEGORY_ID"
            ));
    }
    next();
}


function validateUpdateProduct(req, res, next) {
    const updateFields = req.body;
    if(Object.keys(updateFields).length === 0) {
        return next(
            new BadRequestError(
                "You must have at least one field to change product",
                "PRODUCT_UPDATE_DATA_REQUIRED"
            )
        );
    }

    const allowedFields = ['name', 'description', 'price', 'categoryId'];
    const disallowedFields = Object.keys(updateFields)
        .filter((key) => !allowedFields.includes(key));
    if(disallowedFields.length !== 0) {
        return next(
            new BadRequestError(
                `Request contains unsupported fields: ${disallowedFields.join(', ')}`,
                "UPDATE_INVALID_FIELD"
            )
        );
    }

    if(updateFields.name !== undefined) {
        if(typeof updateFields.name !== "string") {
            return next(
                new BadRequestError(
                    "Name type must be string",
                    "PRODUCT_INVALID_NAME"
                )
            );
        }
        if(updateFields.name.trim() === "") {
            return next(
                new BadRequestError(
                    "Incorrect name value",
                    "PRODUCT_INVALID_NAME"
                )
            );
        }
    }

    if(updateFields.description !== undefined) {
        if(typeof updateFields.description !== "string") {
            return next(
                new BadRequestError(
                    "Description type must be string",
                    "PRODUCT_INVALID_DESCRIPTION"
                )
            );
        }
    }

    if(updateFields.price !== undefined) {
        if(typeof updateFields.price !== "number") {
            return next(
                new BadRequestError(
                    "Price type must be number",
                    "PRODUCT_INVALID_PRICE"
                )
            );
        }
    }

    if(updateFields.categoryId !== undefined) {
        if(typeof updateFields.categoryId !== "number") {
            return next(
                new BadRequestError(
                    "Category ID must be number",
                    "PRODUCT_INVALID_CATEGORY_ID"
                )
            );
        }
    }
    next();
}


function validateProductId(req, res, next) {
    const id = Number(req.params.id);
    if(!Number.isInteger(id) || id <= 0) {
        return next(
            new BadRequestError(
                "Required id must be number greater than 0",
                "PRODUCT_INVALID_ID"
            )
        );
    }
    req.productId = id;
    next();
}


function validateReplaceProduct(req, res, next) {
    const product = req.body;
    if(product.name === null ||
        product.name === undefined) {
        return next(
            new BadRequestError(
                "Name is required",
                "PRODUCT_NAME_REQUIRED"
            )
        );
    }
    if(typeof product.name !== "string" ||
        product.name.trim() === "") {
        return next(
            new BadRequestError(
                "Incorrect name value",
                "PRODUCT_INVALID_NAME"
            )
        );
    }

    if(product.description === null ||
        product.description === undefined) {
        return next(
            new BadRequestError(
                "Description is required",
                "PRODUCT_DESCRIPTION_REQUIRED"
            )
        );
    }
    if(typeof product.description !== "string") {
        return next(
            new BadRequestError(
                "Incorrect description value",
                "PRODUCT_INVALID_DESCRIPTION"
            )
        );
    }

    if(product.price === null || product.price === undefined) {
        return next(
            new BadRequestError(
                "Price is required",
                "PRODUCT_PRICE_REQUIRED"
            )
        );
    }
    if(typeof product.price !== "number") {
        return next(
            new BadRequestError(
                "Incorrect price value",
                "PRODUCT_INVALID_PRICE"
            )
        );
    }

    if(product.categoryId === null || product.categoryId === undefined) {
        return next(
            new BadRequestError(
                "Category ID is required",
                "PRODUCT_CATEGORY_ID_REQUIRED"
            )
        );
    }
    if(typeof product.categoryId !== "number") {
        return next(
            new BadRequestError(
                "Incorrect categoryId value",
                "PRODUCT_INVALID_CATEGORY_ID"
            )
        );
    }
    next();
}


function validateProductQueryParams(req, res, next) {
    const filters = {};
    if(req.query.limit !== undefined) {
        const limit = Number(req.query.limit);
        if(Number.isNaN(limit) || limit <= 0) {
            throw new errors.BadRequestError(
                "Limit must be number greater than 0",
                "LIMIT_INVALID_VALUE"
            );
        }
        filters.limit = limit;
    }
    if(req.query.offset !== undefined) {
        const offset = Number(req.query.offset);
        if(Number.isNaN(offset) || offset < 0) {
            throw new errors.BadRequestError(
                "Offset must be number greater or equal 0",
                "OFFSET_INVALID_VALUE"
            );
        }
        filters.offset = offset;
    }
    if(req.query.categoryId !== undefined) {
        const categoryId = Number(req.query.categoryId);
        if(Number.isNaN(categoryId) || categoryId <= 0) {
            throw new errors.BadRequestError(
                "CategoryId must be number greater than 0",
                "CATEGORY_ID_INVALID_VALUE"
            );
        }
        filters.categoryId = categoryId;
    }
    if(req.query.minPrice !== undefined) {
        const minPrice = Number(req.query.minPrice);
        if(Number.isNaN(minPrice) ||  minPrice < 0) {
            throw new errors.BadRequestError(
                "Minimal price must be number greater or equal 0",
                "MIN_PRICE_INVALID_VALUE"
            );
        }
        filters.minPrice = minPrice;
    }
    if(req.query.maxPrice !== undefined) {
        const maxPrice = Number(req.query.maxPrice);
        if(Number.isNaN(maxPrice) ||  maxPrice < 0) {
            throw new errors.BadRequestError(
                "Maximal price must be number greater or equal 0",
                "MAX_PRICE_INVALID_VALUE"
            );
        }
        filters.maxPrice = maxPrice;
    }
    if(filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        if(filters.maxPrice < filters.minPrice) {
            throw new errors.BadRequestError(
                "Maximal price must be higher or equal Minimal price",
                "PRICE_RANGE_INVALID"
            );
        }
    }

    if(req.query.search !== undefined) {
        const search = req.query.search.trim();
        if(search !== "") {
            if(search.length > 100) {
                throw new errors.BadRequestError(
                    `Search param is too long max length 100 symbols, you have used: ${search.length}`,
                    "SEARCH_INVALID_VALUE"
                );
            }
            filters.search = search;
        }
    }

    const sortBy = req.query.sortBy;
    if(sortBy !== undefined) {
        if(sortBy !== "id" &&
            sortBy !== "name" &&
            sortBy !== "price" &&
            sortBy !== "categoryId") {
            throw new errors.BadRequestError(
                "Product invalid sortBy value",
                "PRODUCT_INVALID_SORT_BY"
            )
        }
            filters.sortBy = sortBy;
    }

    const order = req.query.order;
    if(order !== undefined) {
        if(typeof order === "string") {
            const normalizedOrder = order.toLowerCase();
            if(normalizedOrder !== "asc" &&
                normalizedOrder !== "desc") {
                throw new errors.BadRequestError(
                    "Product invalid sort order value",
                    "PRODUCT_INVALID_SORT_ORDER"
                );
            }
            filters.order = normalizedOrder;
        } else {
            throw new errors.BadRequestError(
                "Product invalid sort order value",
                "PRODUCT_INVALID_SORT_ORDER"
            );
        }
    }


    req.filters = filters;
    next();
}

export {
    validateProductId,
    validateCreateProduct,
    validateUpdateProduct,
    validateReplaceProduct,
    validateProductQueryParams
}
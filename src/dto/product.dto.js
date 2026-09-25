function toProductResponseDTO(product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryId: product.category_id,
    };
}


function toCreateProductDTO(body) {
    return {
        name: body.name,
        description: body.description,
        price: body.price,
        category_id: body.categoryId,
    }
}


function toUpdateProductDTO(body) {
    const updateProductDTO = {};
    if(body.name !== undefined && body.name !== null) {
        updateProductDTO.name = body.name;
    }
    if(body.description !== undefined && body.description !== null) {
        updateProductDTO.description = body.description;
    }
    if(body.price !== undefined && body.price !== null) {
        updateProductDTO.price = body.price;
    }
    if(body.categoryId !== undefined && body.categoryId !== null) {
        updateProductDTO.category_id = body.categoryId;
    }
    return updateProductDTO;
}

export {
    toProductResponseDTO,
    toCreateProductDTO,
    toUpdateProductDTO
}
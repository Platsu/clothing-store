function toProductResponseDto(row) {
    return{
        id: row.id,
        name: row.name,
        price: Number(row.price),
        category: {
            id: row.category_id,
            name: row.category_name
        },
        createdAt: row.created_at
    };
};


const productCreateDto = {
    name: body.name,
    description: body.description,
    price: body.price,
    categoryId: body.categoryId
};


// {
//     "id": 15,
//     "name": "Black Hoodie",
//     "description": "brrrrrr",
//     "price": 2499,
//     "category": {
//     "id": 1,
//         "name": "Hoodie"
// },
//     "images": [
//     {
//         "id": 1,
//         "url": "/images/black-hoodie-main.jpg",
//         "isMain": true
//     },
//     {
//         "id": 2,
//         "url": "/images/black-hoodie-bot.jpg",
//         "isMain": false
//     }
// ],
//     "sizes": [
//     {
//         "id": 1,
//         "name": "S",
//         "stock": 5
//     },
//     {
//         "id": 2,
//         "name": "M",
//         "stock": 3
//     },
//     {
//         "id": 3,
//         "name": "L",
//         "stock": 1
//     },
//     {
//         "id": 4,
//         "name": "XL",
//         "stock": 0
//     }
// ],
//     "reviewSummary": {
//     "averageRating": 4.8,
//         "reviewsCount": 153
// },
//     "discount": {
//     "id": 1,
//         "name": "Summer Sale",
//         "percent": 70,
//         "startsAt": "2026-09-09",
//         "endsAt": "2026-09-23"
// }
// }

const productResponseDto = {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: {
        categoryId: row.category_id,
        name: row.category_name
    },
    createdAt: row.created_at
};


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "Internal server error"
        }
    });
});


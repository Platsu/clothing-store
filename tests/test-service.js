import { getProductById } from "../src/services/product.service.js";
import { createProduct } from "../src/services/product.service.js";
// import {updateProduct} from "../src/services/product.service.js";
//
// const product = {
//     price: 100,
// };
// try {
//     const updatedProduct = await updateProduct(product, 1);
//     console.log(updatedProduct);
// } catch (error) {
//     console.log(error);
// }

const values = [
    "25",
    "25abc",
    "abc",
    "",
    " ",
    undefined,
    null,
    true
];

for (const value of values) {
    console.log("Value:", JSON.stringify(value));
    console.log("Number():", Number(value));
    console.log("parseInt():", parseInt(value));
    console.log("isNaN(value):", isNaN(value));
    console.log("Number.isNaN(Number(value)):", Number.isNaN(Number(value)));
    console.log("----------------");
}
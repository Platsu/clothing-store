import bcrypt from "bcrypt";

async function hashPassword(cost, password) {
    const res = await bcrypt.hash(password, cost);
    return res;
}

async function compareHash(password, hash) {
    const res = await bcrypt.compare(password, hash);
    console.log(res);
}

async function measureCost(cost, password) {
    const start = performance.now();
    await hashPassword(cost, password);
    const time = performance.now() - start;
    console.log(`cost: ${cost} time: ${time}`)
}

async function main() {
    const hash1 = await hashPassword(12, 'password123');
    console.log(hash1);
    const hash2 = await hashPassword(12, 'password123');
    console.log(hash2);

    await compareHash('password123', hash1);
    await compareHash('password124', hash1);
    await compareHash('password123', hash2);

    await measureCost(10, 'password123');
    await measureCost(12, 'password123');
    await measureCost(14, 'password123');
}

main();
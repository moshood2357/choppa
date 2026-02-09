#!/usr/bin/env node

/**
 * Chopify API Test Suite
 * Usage: node test-api.js
 */

import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

let token = null;
let categoryId = null;
let productId = null;
let orderId = null;

const api = axios.create({
    baseURL: API_URL,
    validateStatus: () => true,
    headers: {
        Accept: "application/json",
    },
});

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
};

function log(status, endpoint, message) {
    const icon = status === "PASS" ? "✓" : "✗";
    const color = status === "PASS" ? colors.green : colors.red;
    console.log(`${color}${icon} ${endpoint}${colors.reset} - ${message}`);
}

function logError(res) {
    if (!res?.data) {
        console.log(`${colors.red}  No response body${colors.reset}`);
        return;
    }

    if (res.data.errors) {
        Object.entries(res.data.errors).forEach(([field, messages]) => {
            console.log(
                `${colors.red}  ${field}: ${messages.join(", ")}${colors.reset}`,
            );
        });
    } else {
        console.log(
            `${colors.red}  [${res.status}] ${res.data.message || "Error"}${
                colors.reset
            }`,
        );
    }
}

function unwrap(res) {
    return res?.data?.data ?? res?.data;
}

async function runTests() {
    console.log(`${colors.blue}🚀 Chopify API Test Suite${colors.reset}`);
    console.log(`API URL: ${API_URL}\n`);

    const email = `testuser${Date.now()}@test.com`;

    // =============================
    // 1. REGISTER
    // =============================
    console.log(`${colors.yellow}Testing: User Registration${colors.reset}`);

    const registerRes = await api.post("/auth/register", {
        name: "Test User",
        email,
        password: "password123",
        password_confirmation: "password123",
        store_name: "Test Store",
    });

    if (![200, 201].includes(registerRes.status)) {
        log("FAIL", "POST /auth/register", "Registration failed");
        logError(registerRes);
        return;
    }

    log("PASS", "POST /auth/register", "User registered successfully");

    // =============================
    // 2. LOGIN
    // =============================
    console.log(`\n${colors.yellow}Testing: User Login${colors.reset}`);

    const loginRes = await api.post("/auth/login", {
        email,
        password: "password123",
    });

    if (loginRes.status !== 200) {
        log("FAIL", "POST /auth/login", "Login failed");
        logError(loginRes);
        return;
    }

    token = unwrap(loginRes)?.token;

    if (!token) {
        log("FAIL", "POST /auth/login", "Token missing from response");
        return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    log("PASS", "POST /auth/login", "Login successful");

    // =============================
    // 3. GET CURRENT USER
    // =============================
    console.log(`\n${colors.yellow}Testing: Get Current User${colors.reset}`);

    const meRes = await api.get("/auth/me");

    if (meRes.status !== 200) {
        log("FAIL", "GET /auth/me", "Failed");
        logError(meRes);
        return;
    }

    log("PASS", "GET /auth/me", `Authenticated as ${unwrap(meRes)?.email}`);

    // =============================
    // 4. CREATE CATEGORY
    // =============================
    console.log(`\n${colors.yellow}Testing: Create Category${colors.reset}`);

    const categoryRes = await api.post("/categories", {
        name: `Test Category ${Date.now()}`,
        description: "Test category description",
    });

    if (![200, 201].includes(categoryRes.status)) {
        log("FAIL", "POST /categories", "Failed");
        logError(categoryRes);
        return;
    }

    categoryId = unwrap(categoryRes)?.id;
    log("PASS", "POST /categories", `Category created (ID: ${categoryId})`);

    // =============================
    // 5. CREATE PRODUCT
    // =============================
    console.log(`\n${colors.yellow}Testing: Create Product${colors.reset}`);

    const productRes = await api.post("/products", {
        name: `Test Product ${Date.now()}`,
        description: "Test product description",
        price: 5000,
        quantity: 100,
        category_id: categoryId,
    });

    if (![200, 201].includes(productRes.status)) {
        log("FAIL", "POST /products", "Failed");
        logError(productRes);
        return;
    }

    productId = unwrap(productRes)?.id;
    log("PASS", "POST /products", `Product created (ID: ${productId})`);

    // =============================
    // 6. CREATE ORDER
    // =============================
    console.log(`\n${colors.yellow}Testing: Create Order${colors.reset}`);

    const orderRes = await api.post("/orders", {
        customer_name: "Test Customer",
        customer_email: `customer${Date.now()}@test.com`,
        customer_phone: "08012345678",

        items: [
            {
                product_id: productId,
                quantity: 2,
            },
        ],

        shipping_address: {
            street: "123 Test Street",
            city: "Lagos",
            state: "Lagos",
            postal_code: "100001",
        },

        notes: "Test order",
        channel: "web",
    });

    if (![200, 201].includes(orderRes.status)) {
        log("FAIL", "POST /orders", "Failed");
        logError(orderRes);
        return;
    }

    orderId = unwrap(orderRes)?.id;
    log("PASS", "POST /orders", `Order created (ID: ${orderId})`);

    // =============================
    // 7. LOGOUT
    // =============================
    console.log(`\n${colors.yellow}Testing: Logout${colors.reset}`);

    const logoutRes = await api.post("/auth/logout");

    if (![200, 204].includes(logoutRes.status)) {
        log("FAIL", "POST /auth/logout", "Failed");
        logError(logoutRes);
        return;
    }

    log("PASS", "POST /auth/logout", "Logged out successfully");

    console.log(
        `\n${colors.blue}✓ Test suite completed successfully${colors.reset}\n`,
    );
}

runTests().catch((err) => {
    console.error(`${colors.red}Fatal error: ${err.message}${colors.reset}`);
    process.exit(1);
});

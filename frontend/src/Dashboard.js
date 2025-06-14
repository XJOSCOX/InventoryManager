import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import AddProductForm from "./AddProductForm";

function Dashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);

    // Fetch products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/api/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (res.ok) setProducts(data);
                else console.error("Failed to load products.");
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    // Add new product to state after creation
    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
    };

    return (
        <div className="dashboard">
            <nav className="navbar">
                <h2>📦 Inventory Dashboard</h2>
                <div>
                    {(user.role === "admin" || user.role === "manager") && (
                        <>
                            <button>Add Product</button>
                            <button>Manage Stock</button>
                        </>
                    )}
                    <button onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <main className="dashboard-main">
                <h3>Welcome, {user.username} ({user.role}) 👋</h3>

                {/* Add Product form only for admin or manager */}
                {(user.role === "admin" || user.role === "manager") && (
                    <AddProductForm onProductAdded={handleProductAdded} />
                )}

                {/* Products Table */}
                <h4 style={{ marginTop: "2rem" }}>📋 Product List</h4>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5">No products available.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.sku}</td>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.tags?.join(", ")}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Dashboard;

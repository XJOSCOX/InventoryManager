import React, { useEffect, useState } from "react";
import ProductEditModal from "./ProductEditModal";
import AddProductForm from "./AddProductForm";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [sellQty, setSellQty] = useState({});

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, []);

    // Fetch all products
    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(data);
    };

    // Add new product to state
    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [...prev, newProduct]);
    };

    // Edit
    const handleEdit = (product) => {
        setEditProduct(product);
    };

    // Update edited product
    const handleProductUpdated = (updated) => {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditProduct(null);
    };

    // Delete
    const handleDelete = async (productId) => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) return;
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    // Handle sell quantity change
    const handleSellChange = (id, value) => {
        setSellQty({ ...sellQty, [id]: value });
    };

    // Sell product
    const handleSell = async (productId) => {
        const token = localStorage.getItem("token");
        const quantity = parseInt(sellQty[productId], 10);
        if (!quantity || quantity <= 0) return;
        try {
            const res = await fetch(`http://localhost:5000/api/products/sell/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            });
            if (res.ok) {
                const updated = await res.json();
                setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                setSellQty((prev) => ({ ...prev, [productId]: "" }));
            } else {
                const err = await res.json();
                alert("Sale failed: " + (err.msg || "Unknown error"));
            }
        } catch (err) {
            alert("Sale failed: " + err.message);
        }
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

                {(user.role === "admin" || user.role === "manager") && (
                    <AddProductForm onProductAdded={handleProductAdded} />
                )}

                <h4 style={{ marginTop: "2rem" }}>📋 Product List</h4>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Tags</th>
                            <th>Sold</th>
                            <th>Revenue</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="8">No products available.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.sku}</td>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.tags?.join(", ")}</td>
                                    <td>{product.totalSold}</td>
                                    <td>${product.revenue?.toFixed(2)}</td>
                                    <td>
                                        {(user.role === "admin" || user.role === "manager") && (
                                            <>
                                                <button className="edit-btn" onClick={() => handleEdit(product)}>
                                                    ✏️
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                                    🗑️
                                                </button>
                                                <div className="sell-box">
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        min="1"
                                                        value={sellQty[product.id] || ""}
                                                        onChange={(e) => handleSellChange(product.id, e.target.value)}
                                                        style={{ width: "60px", marginRight: "6px" }}
                                                    />
                                                    <button onClick={() => handleSell(product.id)}>💸 Sell</button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>

            {editProduct && (
                <ProductEditModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onProductUpdated={handleProductUpdated}
                />
            )}
        </div>
    );
}

export default Dashboard;

import React, { useState } from "react";
import "./AddProductForm.css";

function AddProductForm({ onProductAdded }) {
    const [form, setForm] = useState({
        name: "",
        sku: "",
        quantity: "",
        price: "",
        tags: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const product = {
            ...form,
            quantity: parseInt(form.quantity),
            price: parseFloat(form.price),
            tags: form.tags.split(",").map(tag => tag.trim())
        };

        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(product),
            });

            if (res.ok) {
                const newProduct = await res.json();
                onProductAdded(newProduct);
                setForm({ name: "", sku: "", quantity: "", price: "", tags: "" });
            } else {
                console.error("Failed to add product");
            }
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    return (
        <form className="add-product-form" onSubmit={handleSubmit}>
            <h3>➕ Add Product</h3>
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default AddProductForm;

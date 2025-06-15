import React, { useState, useEffect } from "react";
import "./Modal.css";

function ProductEditModal({ product, onClose, onProductUpdated }) {
    const [formData, setFormData] = useState({ ...product });

    useEffect(() => {
        setFormData({ ...product });
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity),
                    tags: formData.tags.split(",").map((tag) => tag.trim()),
                }),
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                onProductUpdated(updatedProduct);
                onClose();
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <label>
                        SKU:
                        <input name="sku" value={formData.sku} onChange={handleChange} required />
                    </label>
                    <label>
                        Quantity:
                        <input
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Tags (comma separated):
                        <input name="tags" value={formData.tags} onChange={handleChange} />
                    </label>
                    <div className="modal-actions">
                        <button type="submit">Update</button>
                        <button type="button" onClick={onClose} className="cancel">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEditModal;

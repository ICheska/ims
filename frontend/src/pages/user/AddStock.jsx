/*import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AddStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`http://localhost:5000/api/products/${id}/add-stock`, {
      quantity: Number(quantity)
    });

    navigate("/products");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="user-page">
      <h2>Add Stock for {product.name}</h2>

      <form onSubmit={handleSubmit}>
        <label>Quantity Received</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
*/


//cheska
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AddStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;


        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProduct(res.data);

      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchProduct();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

    const res = await axios.put(
       `http://localhost:5000/api/products/${id}/addStock`,
      { quantity: Number(quantity) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    console.log("Backend response:", res.data);

    // 🔥 SUCCESS MESSAGE (correct)
    alert("Stock added successfully!");

    navigate("/user/products");

  } catch (error) {
    console.log("Error adding stock:", error.response || error);
    alert("Failed to add stock");
  }
};


  if (!product) return <p>Loading...</p>;

  return (
    <div className="user-page">
      <h2>Add Stock for {product.name}</h2>

      <form onSubmit={handleSubmit}>
        <label>Quantity Received</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}


/*import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AddStock() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user || user.role !== "User") {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/products/addstock/${id}`,
        { amount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Stock added successfully!");
      navigate("/user/products");
    } catch (err) {
      alert("Failed to add stock");
      console.error(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>Add Stock to: {product.name}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter stock amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
}
*/
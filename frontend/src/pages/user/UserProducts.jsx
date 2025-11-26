import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });


        console.log("TOKEN IN LOCAL STORAGE:", localStorage.getItem("token"));

        console.log("RAW DATA FROM BACKEND:", data);
        console.log("Products loaded:", data);
        


        // FIX: backend returns { products: [], lowStockItems: [] }
        setProducts(data.products);
        setFiltered(data.products);

      } catch (err) {
        console.error("Product load error:", err);
      }
    };
  loadProducts();
  }, []);
  

  useEffect(() => {
    setFiltered(
      products.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  return (
    <div className="user-page">
      <h2>Products</h2>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="product-list">
        {filtered.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p>Brand: {product.brand}</p>
            <p>Category: {product.category}</p>
           <p>Stocks: {product.stock}</p>


            <Link to={`/user/addstock/${product._id}`} className="btn">
              Add Stock
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


import React, { useEffect, useState } from "react";
import axios from "axios";
import c from "./Perfume.module.scss";

const Perfume = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
    size: 0,
    gender: "MALE",
  });

  const token = localStorage.getItem("token");

  const fetchPerfumes = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/parfume", {
        headers: { Authorization: token },
      });
      setPerfumes(res.data);
    } catch (err) {
      setError("Failed to load perfumes");
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/parfume/${id}`, {
        headers: { Authorization: token },
      });
      fetchPerfumes();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:9000/api/parfume/${editModal.id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      setEditModal(null);
      fetchPerfumes();
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:9000/api/parfume", formData, {
        headers: { Authorization: token },
      });
      setCreateModal(false);
      fetchPerfumes();
    } catch (err) {
      setError("Create failed");
    }
  };

  const openEditModal = (perfume) => {
    setFormData(perfume);
    setEditModal(perfume);
  };

  return (
    <div className={c.perfumeContainer}>
      <h2>Perfume List</h2>
      {error && <p className={c.error}>{error}</p>}
      <table className={c.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Size</th>
            <th>Gender</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {perfumes.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.size}ml</td>
              <td>{p.gender}</td>
              <td>
                <img src={p.image} alt={p.name} className={c.image} />
              </td>
              <td>
                <button onClick={() => openEditModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editModal || createModal) && (
        <div className={c.modal}>
          <div className={c.modalContent}>
            <h3>{editModal ? "Edit Perfume" : "Create Perfume"}</h3>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
            />
            <input
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Size (ml)"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: parseInt(e.target.value) })
              }
            />
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
            <div className={c.modalActions}>
              <button onClick={editModal ? handleUpdate : handleCreate}>
                {editModal ? "Update" : "Create"}
              </button>
              <button
                onClick={() => {
                  setEditModal(null);
                  setCreateModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={c.fab}
        onClick={() => {
          setFormData({
            name: "",
            brand: "",
            description: "",
            price: 0,
            stock: 0,
            image: "",
            size: 0,
            gender: "MALE",
          });
          setCreateModal(true);
        }}
      >
        +
      </button>
    </div>
  );
};

export default Perfume;

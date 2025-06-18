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
    season: "ALL_SEASONS",
    occasion: "DAILY",
    intensity: "MODERATE",
    fragranceFamily: "FLORAL",
    topNotes: [],
    middleNotes: [],
    baseNotes: [],
    longevity: 5,
    sillage: 3,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("");
  const [intensityFilter, setIntensityFilter] = useState("");
  const [fragranceFamilyFilter, setFragranceFamilyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchPerfumes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (minPriceFilter !== "") params.append("minPrice", minPriceFilter);
      if (maxPriceFilter !== "") params.append("maxPrice", maxPriceFilter);
      if (genderFilter) params.append("gender", genderFilter);
      if (seasonFilter) params.append("season", seasonFilter);
      if (occasionFilter) params.append("occasion", occasionFilter);
      if (intensityFilter) params.append("intensity", intensityFilter);
      if (fragranceFamilyFilter)
        params.append("fragranceFamily", fragranceFamilyFilter);
      params.append("page", currentPage);
      params.append("limit", 10);

      const queryString = params.toString();
      const url = `https://server-production-45af.up.railway.app/api/parfume${
        queryString ? `?${queryString}` : ""
      }`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerfumes(res.data.perfumes);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to load perfumes");
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, [
    searchQuery,
    minPriceFilter,
    maxPriceFilter,
    genderFilter,
    seasonFilter,
    occasionFilter,
    intensityFilter,
    fragranceFamilyFilter,
    currentPage,
  ]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://server-production-45af.up.railway.app/api/parfume/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPerfumes();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const preparePerfumeData = () => {
    return {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      size: parseInt(formData.size),
      longevity: parseInt(formData.longevity),
      sillage: parseInt(formData.sillage),
      topNotes: formData.topNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),
      middleNotes: formData.middleNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),
      baseNotes: formData.baseNotes
        .split(",")
        .map((note) => note.trim())
        .filter(Boolean),
    };
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `https://server-production-45af.up.railway.app/api/parfume/${editModal.id}`,
        preparePerfumeData(),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModal(null);
      fetchPerfumes();
    } catch (err) {
      setError(
        "Update failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        "https://server-production-45af.up.railway.app/api/parfume",
        preparePerfumeData(),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreateModal(false);
      fetchPerfumes();
    } catch (err) {
      setError(
        "Create failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const openEditModal = (perfume) => {
    setFormData({
      ...perfume,
      topNotes: perfume.topNotes.join(", "),
      middleNotes: perfume.middleNotes.join(", "),
      baseNotes: perfume.baseNotes.join(", "),
    });
    setEditModal(perfume);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinPriceFilter("");
    setMaxPriceFilter("");
    setGenderFilter("");
    setSeasonFilter("");
    setOccasionFilter("");
    setIntensityFilter("");
    setFragranceFamilyFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const commonSelectProps = {
    className: c.filterSelect,
  };

  return (
    <div className={c.perfumeContainer}>
      <h2>Perfume List</h2>
      {error && <p className={c.error}>{error}</p>}
      <div className={c.filters}>
        <input
          type="text"
          placeholder="Search by name, brand, or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={c.filterInput}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPriceFilter}
          onChange={(e) => setMinPriceFilter(e.target.value)}
          className={c.filterInput}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(e.target.value)}
          className={c.filterInput}
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          {...commonSelectProps}
        >
          <option value="">All Genders</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="UNISEX">UNISEX</option>
        </select>
        <select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          {...commonSelectProps}
        >
          <option value="">All Seasons</option>
          <option value="SPRING">SPRING</option>
          <option value="SUMMER">SUMMER</option>
          <option value="AUTUMN">AUTUMN</option>
          <option value="WINTER">WINTER</option>
          <option value="ALL_SEASONS">ALL SEASONS</option>
        </select>
        <select
          value={occasionFilter}
          onChange={(e) => setOccasionFilter(e.target.value)}
          {...commonSelectProps}
        >
          <option value="">All Occasions</option>
          <option value="DAILY">DAILY</option>
          <option value="EVENING">EVENING</option>
          <option value="SPECIAL">SPECIAL</option>
          <option value="WORK">WORK</option>
          <option value="CASUAL">CASUAL</option>
        </select>
        <select
          value={intensityFilter}
          onChange={(e) => setIntensityFilter(e.target.value)}
          {...commonSelectProps}
        >
          <option value="">All Intensities</option>
          <option value="LIGHT">LIGHT</option>
          <option value="MODERATE">MODERATE</option>
          <option value="STRONG">STRONG</option>
          <option value="VERY_STRONG">VERY STRONG</option>
        </select>
        <select
          value={fragranceFamilyFilter}
          onChange={(e) => setFragranceFamilyFilter(e.target.value)}
          {...commonSelectProps}
        >
          <option value="">All Fragrance Families</option>
          <option value="FLORAL">FLORAL</option>
          <option value="ORIENTAL">ORIENTAL</option>
          <option value="WOODY">WOODY</option>
          <option value="FRESH">FRESH</option>
          <option value="CHYPRE">CHYPRE</option>
          <option value="FOUGERE">FOUGERE</option>
          <option value="GOURMAND">GOURMAND</option>
        </select>
        <button onClick={handleResetFilters} className={c.resetButton}>
          Reset Filters
        </button>
      </div>
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
      <div className={c.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`${c.pageButton} ${
              currentPage === i + 1 ? c.activePage : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
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
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
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
                setFormData({ ...formData, size: e.target.value })
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
              <option value="UNISEX">UNISEX</option>
            </select>
            <select
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
            >
              <option value="SPRING">SPRING</option>
              <option value="SUMMER">SUMMER</option>
              <option value="AUTUMN">AUTUMN</option>
              <option value="WINTER">WINTER</option>
              <option value="ALL_SEASONS">ALL SEASONS</option>
            </select>
            <select
              value={formData.occasion}
              onChange={(e) =>
                setFormData({ ...formData, occasion: e.target.value })
              }
            >
              <option value="DAILY">DAILY</option>
              <option value="EVENING">EVENING</option>
              <option value="SPECIAL">SPECIAL</option>
              <option value="WORK">WORK</option>
              <option value="CASUAL">CASUAL</option>
            </select>
            <select
              value={formData.intensity}
              onChange={(e) =>
                setFormData({ ...formData, intensity: e.target.value })
              }
            >
              <option value="LIGHT">LIGHT</option>
              <option value="MODERATE">MODERATE</option>
              <option value="STRONG">STRONG</option>
              <option value="VERY_STRONG">VERY STRONG</option>
            </select>
            <select
              value={formData.fragranceFamily}
              onChange={(e) =>
                setFormData({ ...formData, fragranceFamily: e.target.value })
              }
            >
              <option value="FLORAL">FLORAL</option>
              <option value="ORIENTAL">ORIENTAL</option>
              <option value="WOODY">WOODY</option>
              <option value="FRESH">FRESH</option>
              <option value="CHYPRE">CHYPRE</option>
              <option value="FOUGERE">FOUGERE</option>
              <option value="GOURMAND">GOURMAND</option>
            </select>
            <input
              placeholder="Top Notes (comma-separated)"
              value={formData.topNotes}
              onChange={(e) =>
                setFormData({ ...formData, topNotes: e.target.value })
              }
            />
            <input
              placeholder="Middle Notes (comma-separated)"
              value={formData.middleNotes}
              onChange={(e) =>
                setFormData({ ...formData, middleNotes: e.target.value })
              }
            />
            <input
              placeholder="Base Notes (comma-separated)"
              value={formData.baseNotes}
              onChange={(e) =>
                setFormData({ ...formData, baseNotes: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Longevity (1-12 hours)"
              value={formData.longevity}
              onChange={(e) =>
                setFormData({ ...formData, longevity: e.target.value })
              }
              min="1"
              max="12"
            />
            <input
              type="number"
              placeholder="Sillage (1-5)"
              value={formData.sillage}
              onChange={(e) =>
                setFormData({ ...formData, sillage: e.target.value })
              }
              min="1"
              max="5"
            />
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
            season: "ALL_SEASONS",
            occasion: "DAILY",
            intensity: "MODERATE",
            fragranceFamily: "FLORAL",
            topNotes: [],
            middleNotes: [],
            baseNotes: [],
            longevity: 5,
            sillage: 3,
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

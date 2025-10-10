import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dữ liệu giả
const mockShippers = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: `Shipper ${i + 1}`,
  phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
  email: `shipper${i + 1}@example.com`,
}));

const ITEMS_PER_PAGE = 20;

const PendingShipperList = () => {
  const [shippers, setShippers] = useState(mockShippers);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(shippers.length / ITEMS_PER_PAGE);

  const handleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const handleSelectAll = () => {
    const pageShippers = shippers
      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      .map((s) => s.id);
    const allSelected = pageShippers.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected(selected.filter((id) => !pageShippers.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...pageShippers])]);
    }
  };

  const handleApprove = (id) => {
    setShippers(shippers.filter((s) => s.id !== id));
    setSelected(selected.filter((sid) => sid !== id));
    alert(`Đã duyệt shipper ID ${id}`);
  };

  const handleApproveAll = () => {
    setShippers(shippers.filter((s) => !selected.includes(s.id)));
    setSelected([]);
    alert("Đã duyệt tất cả shipper được chọn!");
  };

  const paginatedShippers = shippers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Shipper cần duyệt</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Chọn tất cả trang này
        </button>
        <button
          onClick={handleApproveAll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Duyệt tất cả
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {paginatedShippers.map((shipper) => (
          <div
            key={shipper.id}
            className="flex justify-between items-center p-4 border rounded shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selected.includes(shipper.id)}
                onChange={() => handleSelect(shipper.id)}
                className="w-5 h-5"
              />
              <div>
                <div className="font-semibold text-lg">{shipper.name}</div>
                <div className="text-gray-600">SĐT: {shipper.phone}</div>
                <div className="text-gray-600">Email: {shipper.email}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/shipper/profile-detail/${shipper.id}`}>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Xem chi tiết</button>
              </Link>
              <button
                onClick={() => handleApprove(shipper.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Duyệt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PendingShipperList;
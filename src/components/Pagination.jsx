import React from "react";
import "./Pagination.css";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to render
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-bar">
      {/* Left: Summary Counter */}
      <div className="pagination-info">
        Showing <b>{startItem}</b> to <b>{endItem}</b> of <b>{totalItems}</b> entries
      </div>

      {/* Center/Right: Controls */}
      <div className="pagination-controls">
        {/* Page Size Selector */}
        {onPageSizeChange && (
          <div className="page-size-selector">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* First & Prev Buttons */}
        <button
          className="pag-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          title="First Page"
        >
          ⏮
        </button>
        <button
          className="pag-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous Page"
        >
          ◀
        </button>

        {/* Page Numbers */}
        <div className="page-num-list">
          {pageNumbers.map((num) => (
            <button
              key={num}
              className={`pag-num ${num === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next & Last Buttons */}
        <button
          className="pag-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next Page"
        >
          ▶
        </button>
        <button
          className="pag-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Last Page"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

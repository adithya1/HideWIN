import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading }) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className={`posh-pagination-wrapper ${isLoading ? 'loading' : ''}`}>
            <button
                className="posh-page-btn nav-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
            >
                <ChevronLeft size={18} />
            </button>

            {getPages().map((p, i) => (
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="posh-ellipsis"><MoreHorizontal size={16} /></span>
                ) : (
                    <button
                        key={p}
                        className={`posh-page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                        disabled={isLoading || currentPage === p}
                    >
                        {p}
                    </button>
                )
            ))}

            <button
                className="posh-page-btn nav-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}

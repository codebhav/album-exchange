import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export const PaginationControls = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			pageNumbers.push(1);

			// find start and end of the middle section
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			if (start > 2) {
				pageNumbers.push("...");
			}

			for (let i = start; i <= end; i++) {
				pageNumbers.push(i);
			}

			if (end < totalPages - 1) {
				pageNumbers.push("...");
			}

			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	};

	return (
		<div className="pagination-controls" aria-label="Pagination navigation">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="pagination-button"
				aria-label="Previous page"
			>
				<IoChevronBack />
			</button>

			{getPageNumbers().map((pageNum, index) =>
				pageNum === "..." ? (
					<span
						key={`ellipsis-${index}`}
						className="pagination-ellipsis"
					>
						...
					</span>
				) : (
					<button
						key={`page-${pageNum}`}
						onClick={() => onPageChange(pageNum)}
						className={`pagination-number-button ${
							pageNum === currentPage ? "active" : ""
						}`}
						aria-label={`Page ${pageNum}`}
						aria-current={
							pageNum === currentPage ? "page" : undefined
						}
					>
						{pageNum}
					</button>
				)
			)}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="pagination-button"
				aria-label="Next page"
			>
				<IoChevronForward />
			</button>
		</div>
	);
};

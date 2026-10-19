import { getBookCover } from "../../utils/bookCover.js";
import { Link } from "react-router-dom";

function BookCard({ book }) {
  const isAvailable = book.quantityAvailable > 0;

  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        <img src={getBookCover(book)} alt={book.title} className="book-cover" />
      </div>
      <div className="book-info">
        <span className="book-category">{book.category}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>

        <p className="book-rating">
          ★ {(book.rating ?? 0).toFixed(1)}
        </p>

        <p className={isAvailable ? "book-status available" : "book-status unavailable"}>
          {isAvailable
            ? `พร้อมให้เช่า (${book.quantityAvailable}/${book.quantityTotal} เล่ม)`
            : "ไม่พร้อมให้เช่า"}
        </p>

        <Link to={`/books/${book._id}`} className="btn btn-outline book-btn">
          ดูรายละเอียด
        </Link>
      </div>
    </article>
  );
}

export default BookCard;

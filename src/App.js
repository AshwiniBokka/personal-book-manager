import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [rating, setRating] = useState(3);
  const [status, setStatus] = useState("Want to Read");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load books from localStorage when component mounts
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('personalBooks');
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks);
        setBooks(Array.isArray(parsedBooks) ? parsedBooks : []);
      }
    } catch (error) {
      console.error("Error loading books:", error);
      setBooks([]);
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    try {
      localStorage.setItem('personalBooks', JSON.stringify(books));
    } catch (error) {
      console.error("Error saving books:", error);
    }
  }, [books]);

  const addBook = (e) => {
    e.preventDefault();
    if (title.trim() !== "" && author.trim() !== "") {
      const newBook = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        genre,
        rating,
        status,
        notes: notes.trim(),
      };
      setBooks(prevBooks => [...prevBooks, newBook]);
      
      // Reset form
      setTitle("");
      setAuthor("");
      setGenre("Fiction");
      setRating(3);
      setStatus("Want to Read");
      setNotes("");
    }
  };

  const removeBook = (id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  const toggleStatus = (id) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id 
          ? { ...book, status: book.status === "Read" ? "Want to Read" : "Read" }
          : book
      )
    );
  };

  // Filter books based on search
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Personal Book Manager</h1>
        <p>Organize your reading journey in the cloud</p>
      </header>

      <main className="main-container">
        {/* Add Book Form */}
        <section className="add-book-section">
          <h2>Add a New Book</h2>
          <form onSubmit={addBook} className="book-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Book Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Biography">Biography</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="History">History</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-5)</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? '★' : num === 5 ? '★★★★★' : '★'.repeat(num)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Reading Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Currently Reading">Currently Reading</option>
                  <option value="Read">Read</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your thoughts about the book"
                  rows="3"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Add Book to Collection
            </button>
          </form>
        </section>

        {/* Book Collection */}
        <section className="book-collection">
          <h2>Your Book Collection ({filteredBooks.length})</h2>
          
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books by title, author, or genre..."
            />
          </div>

          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              {books.length === 0 
                ? "Your book collection is empty. Add your first book above!"
                : "No books match your search. Try different keywords."
              }
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map(book => (
                <div key={book.id} className="book-card">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  
                  <div className="book-details">
                    <span className="book-genre">{book.genre}</span>
                    <span className="book-rating">
                      {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
                    </span>
                  </div>

                  <div className={`book-status ${book.status.toLowerCase().replace(' ', '-')}`}>
                    {book.status}
                  </div>

                  {book.notes && (
                    <p className="book-notes">"{book.notes}"</p>
                  )}

                  <div className="book-actions">
                    <button 
                      onClick={() => toggleStatus(book.id)} 
                      className="btn btn-primary"
                    >
                      Mark {book.status === "Read" ? "Unread" : "Read"}
                    </button>
                    <button 
                      onClick={() => removeBook(book.id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
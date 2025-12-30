-- =========================
-- Drop existing tables if they exist
-- =========================
DROP TABLE IF EXISTS user_reservation CASCADE;
DROP TABLE IF EXISTS reservation CASCADE;
DROP TABLE IF EXISTS book_authors CASCADE;
DROP TABLE IF EXISTS book_publisher CASCADE;
DROP TABLE IF EXISTS book CASCADE;
DROP TABLE IF EXISTS author CASCADE;
DROP TABLE IF EXISTS publisher CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS user_member CASCADE;

-- =========================
-- Users Table
-- =========================
CREATE TABLE user_member (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email_id VARCHAR(150) UNIQUE NOT NULL,
    contactno VARCHAR(20),
    address VARCHAR(255),
    aadhar_id VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON user_member(email_id);
CREATE INDEX idx_user_status ON user_member(status);

-- =========================
-- Category Table
-- =========================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- =========================
-- Publisher Table
-- =========================
CREATE TABLE publisher (
    publisher_id SERIAL PRIMARY KEY,
    publisher_name VARCHAR(255) NOT NULL
);

-- =========================
-- Author Table
-- =========================
CREATE TABLE author (
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL
);

-- =========================
-- Book Table
-- =========================
CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES category(category_id)
);

-- =========================
-- Book-Publisher Many-to-Many
-- =========================
CREATE TABLE book_publisher (
    book_id INT REFERENCES book(book_id) ON DELETE CASCADE,
    publisher_id INT REFERENCES publisher(publisher_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, publisher_id)
);

-- =========================
-- Book-Authors Many-to-Many
-- =========================
CREATE TABLE book_authors (
    book_id INT REFERENCES book(book_id) ON DELETE CASCADE,
    author_id INT REFERENCES author(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- =========================
-- Reservation Table
-- =========================
CREATE TABLE reservation (
    reservation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user_member(user_id),
    reservation_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reservation_return_date TIMESTAMP
);

-- =========================
-- User-Reservation Table
-- =========================
CREATE TABLE user_reservation (
    reservation_id INT REFERENCES reservation(reservation_id) ON DELETE CASCADE,
    book_id INT REFERENCES book(book_id) ON DELETE CASCADE,
    book_return_date TIMESTAMP,
    PRIMARY KEY (reservation_id, book_id)
);

-- =========================
-- Users Table Data Insertion
-- =========================
INSERT INTO user_member
(user_name, email_id, contactno, address, aadhar_id, status)
VALUES
('Amit Sharma', 'amit.sharma@example.com', '9876543210', 'Pune, Maharashtra', '123412341234', 'ACTIVE'),
('Neha Verma', 'neha.verma@example.com', '9876543211', 'Mumbai, Maharashtra', '123412341235', 'ACTIVE'),
('Rohit Kulkarni', 'rohit.kulkarni@example.com', '9876543212', 'Nagpur, Maharashtra', '123412341236', 'ACTIVE'),
('Priya Singh', 'priya.singh@example.com', '9876543213', 'New Delhi', '123412341237', 'ACTIVE'),
('Ankit Jain', 'ankit.jain@example.com', '9876543214', 'Indore, Madhya Pradesh', '123412341238', 'ACTIVE'),
('Sneha Patil', 'sneha.patil@example.com', '9876543215', 'Kolhapur, Maharashtra', '123412341239', 'ACTIVE'),
('Rahul Mehta', 'rahul.mehta@example.com', '9876543216', 'Ahmedabad, Gujarat', '123412341240', 'ACTIVE'),
('Kavita Nair', 'kavita.nair@example.com', '9876543217', 'Kochi, Kerala', '123412341241', 'ACTIVE'),
('Suresh Iyer', 'suresh.iyer@example.com', '9876543218', 'Chennai, Tamil Nadu', '123412341242', 'ACTIVE'),
('Pooja Deshmukh', 'pooja.deshmukh@example.com', '9876543219', 'Aurangabad, Maharashtra', '123412341243', 'ACTIVE');

-- =========================
-- Category Table Data Insertion
-- =========================
INSERT INTO category (category_name)
VALUES
('Computer Science'),
('Artificial Intelligence'),
('Data Science'),
('Databases'),
('Networking'),
('Operating Systems'),
('Cloud Computing'),
('Cyber Security'),
('Software Engineering'),
('DevOps');

-- =========================
-- Author Table Data Insertion
-- =========================
INSERT INTO author (author_name)
VALUES
('Robert C. Martin'),
('Martin Fowler'),
('Andrew Tanenbaum'),
('Donald Knuth'),
('Bjarne Stroustrup'),
('James Gosling'),
('Eric Evans'),
('Kent Beck'),
('Brian Kernighan'),
('Linus Torvalds');

-- =========================
-- Publisher Table Data Insertion
-- =========================
INSERT INTO publisher (publisher_name)
VALUES
('O''Reilly Media'),
('Pearson Education'),
('Addison-Wesley'),
('McGraw-Hill'),
('Packt Publishing'),
('Apress'),
('Manning Publications'),
('Wiley'),
('Springer'),
('MIT Press');


INSERT INTO book (book_name, category_id) VALUES
('Clean Code', 7),
('Refactoring', 7),
('Design Patterns', 7),
('Structure and Interpretation of Computer Programs', 1),
('Operating System Concepts', 6),
('Computer Networks', 5),
('Domain-Driven Design', 7),
('Introduction to Algorithms', 1),
('Database System Concepts', 4),
('Machine Learning: A Probabilistic Perspective', 10);


INSERT INTO book_authors (book_id, author_id) VALUES
(1, 1),   -- Clean Code → Robert C. Martin
(2, 2),   -- Refactoring → Martin Fowler
(3, 4),   -- Design Patterns → Donald Knuth (example)
(4, 10),  -- SICP → Brian Kernighan
(5, 3),   -- OS Concepts → Andrew Tanenbaum
(6, 3),   -- Computer Networks → Andrew Tanenbaum
(7, 7),   -- DDD → Eric Evans
(8, 4),   -- Algorithms → Donald Knuth
(9, 2),   -- DB Concepts → Martin Fowler
(10, 6);  -- ML → James Gosling (example)

INSERT INTO book_publisher (book_id, publisher_id) VALUES
(1, 3),   -- Addison-Wesley
(2, 3),
(3, 7),
(4, 6),
(5, 2),
(6, 2),
(7, 3),
(8, 6),
(9, 2),
(10, 10);


-- The STRING_AGG function in SQL is an aggregate function that concatenates string values from multiple rows 
-- into a single string, with a specified separator
-- if you have more than one author or publisher for a book, this query will combine their names into a 
-- single field separated by commas.
-- Example query to get book details with authors and publishers
SELECT
    b.book_id,
    b.book_name,
    c.category_name,
    STRING_AGG(DISTINCT a.author_name, ', ') AS authors,
    STRING_AGG(DISTINCT p.publisher_name, ', ') AS publishers
FROM book b
JOIN category c ON b.category_id = c.category_id
JOIN book_authors ba ON b.book_id = ba.book_id
JOIN author a ON ba.author_id = a.author_id
JOIN book_publisher bp ON b.book_id = bp.book_id
JOIN publisher p ON bp.publisher_id = p.publisher_id
GROUP BY b.book_id, b.book_name, c.category_name;
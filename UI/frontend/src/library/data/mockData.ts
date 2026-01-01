// Mock data for library management system

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipDate: string;
  status: "active" | "inactive";
  borrowedBooks: string[];
}

export interface Author {
  id: string;
  name: string;
  biography: string;
  dateOfBirth: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Publisher {
  id: string;
  name: string;
  country: string;
  website: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  author: Author;
  category: Category;
  publisher: Publisher;
  publicationDate: string;
  quantity: number;
  availableQuantity: number;
  description: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-0101",
    membershipDate: "2023-01-15",
    status: "active",
    borrowedBooks: ["1", "3"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-0102",
    membershipDate: "2023-02-20",
    status: "active",
    borrowedBooks: ["2"],
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "555-0103",
    membershipDate: "2023-03-10",
    status: "inactive",
    borrowedBooks: [],
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "555-0104",
    membershipDate: "2023-04-05",
    status: "active",
    borrowedBooks: ["4"],
  },
];

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "J.K. Rowling",
    biography: "British author of the Harry Potter series",
    dateOfBirth: "1965-07-31",
  },
  {
    id: "2",
    name: "Stephen King",
    biography: "American horror and fantasy author",
    dateOfBirth: "1947-09-21",
  },
  {
    id: "3",
    name: "George R. R. Martin",
    biography: "American novelist and writer",
    dateOfBirth: "1948-09-20",
  },
  {
    id: "4",
    name: "J.R.R. Tolkien",
    biography: "English writer and philologist",
    dateOfBirth: "1892-01-03",
  },
  {
    id: "5",
    name: "Agatha Christie",
    biography: "British detective novelist",
    dateOfBirth: "1890-01-15",
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fiction",
    description: "Fictional novels and stories",
  },
  {
    id: "2",
    name: "Mystery",
    description: "Detective and mystery novels",
  },
  {
    id: "3",
    name: "Science Fiction",
    description: "Science fiction and futuristic stories",
  },
  {
    id: "4",
    name: "Fantasy",
    description: "Fantasy and adventure novels",
  },
  {
    id: "5",
    name: "Non-Fiction",
    description: "Non-fiction and educational books",
  },
];

// Mock Publishers
export const mockPublishers: Publisher[] = [
  {
    id: "1",
    name: "Penguin Books",
    country: "United Kingdom",
    website: "www.penguin.com",
  },
  {
    id: "2",
    name: "Simon & Schuster",
    country: "United States",
    website: "www.simonandschuster.com",
  },
  {
    id: "3",
    name: "HarperCollins",
    country: "United States",
    website: "www.harpercollins.com",
  },
  {
    id: "4",
    name: "Bloomsbury Publishing",
    country: "United Kingdom",
    website: "www.bloomsbury.com",
  },
  {
    id: "5",
    name: "Scholastic",
    country: "United States",
    website: "www.scholastic.com",
  },
];

// Mock Books
export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "978-0747532699",
    author: mockAuthors[0],
    category: mockCategories[3],
    publisher: mockPublishers[3],
    publicationDate: "1998-06-26",
    quantity: 5,
    availableQuantity: 3,
    description: "The first book in the Harry Potter series",
  },
  {
    id: "2",
    title: "The Shining",
    isbn: "978-0385333312",
    author: mockAuthors[1],
    category: mockCategories[1],
    publisher: mockPublishers[0],
    publicationDate: "1977-05-28",
    quantity: 3,
    availableQuantity: 2,
    description: "A psychological horror novel",
  },
  {
    id: "3",
    title: "A Game of Thrones",
    isbn: "978-0553103540",
    author: mockAuthors[2],
    category: mockCategories[3],
    publisher: mockPublishers[1],
    publicationDate: "1996-08-06",
    quantity: 4,
    availableQuantity: 2,
    description: "The first book in A Song of Ice and Fire series",
  },
  {
    id: "4",
    title: "The Hobbit",
    isbn: "978-0547928227",
    author: mockAuthors[3],
    category: mockCategories[3],
    publisher: mockPublishers[0],
    publicationDate: "1937-09-21",
    quantity: 6,
    availableQuantity: 4,
    description: "A fantasy adventure novel",
  },
  {
    id: "5",
    title: "Murder on the Orient Express",
    isbn: "978-0062693556",
    author: mockAuthors[4],
    category: mockCategories[1],
    publisher: mockPublishers[2],
    publicationDate: "1934-01-01",
    quantity: 3,
    availableQuantity: 3,
    description: "A classic detective mystery novel",
  },
];

// Mock Borrow Records
export const mockBorrowRecords: BorrowRecord[] = [
  {
    id: "1",
    userId: "1",
    bookId: "1",
    borrowDate: "2024-01-10",
    dueDate: "2024-01-24",
    status: "borrowed",
  },
  {
    id: "2",
    userId: "1",
    bookId: "3",
    borrowDate: "2024-01-12",
    dueDate: "2024-01-26",
    status: "borrowed",
  },
  {
    id: "3",
    userId: "2",
    bookId: "2",
    borrowDate: "2024-01-05",
    dueDate: "2024-01-19",
    returnDate: "2024-01-18",
    status: "returned",
  },
  {
    id: "4",
    userId: "4",
    bookId: "4",
    borrowDate: "2024-01-08",
    dueDate: "2024-01-22",
    status: "borrowed",
  },
  {
    id: "5",
    userId: "3",
    bookId: "5",
    borrowDate: "2023-12-15",
    dueDate: "2023-12-29",
    status: "overdue",
  },
];

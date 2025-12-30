from book_pb2 import BookDetails, GetAllBooksResponse


# def map_flat_to_proto(rows):
#         books_dict = {}  # key: book_id, value: info dict

#         for book_id, book_name, category_name, author_name, publisher_name in rows:
#             if book_id not in books_dict:
#                 books_dict[book_id] = {
#                     "book_name": book_name,
#                     "category_name": category_name,
#                     "authors": set(),
#                     "publishers": set()
#                 }
#             books_dict[book_id]["authors"].add(author_name)
#             books_dict[book_id]["publishers"].add(publisher_name)

#         book_messages = []
#         for book_id, info in books_dict.items():
#             book_msg = BookDetails(
#                 book_id=book_id,
#                 book_name=info["book_name"],
#                 category_name=info["category_name"],
#                 author_name=list(info["authors"]),
#                 publisher_name=list(info["publishers"])
#             )
#             book_messages.append(book_msg)

#         return GetAllBooksResponse(book=book_messages)
def map_to_proto(rows):
    book_messages = []

    for book_id, book_name, category_name, authors, publishers in rows:
        book_msg = BookDetails(
            book_id=book_id,
            book_name=book_name,
            category_name=category_name,
            author_name=authors or [],
            publisher_name=publishers or []
        )
        book_messages.append(book_msg)

    return GetAllBooksResponse(book=book_messages)

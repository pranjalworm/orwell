export interface File {
  id: string;
  name: string;
  fileType: string;
  filePath: string;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  dateAdded: Date;
  datePublished?: Date;
  coverImageUrl?: URL;
}

export interface BookFile {
  id: string;
  fileId: string;
  bookId: string;
}

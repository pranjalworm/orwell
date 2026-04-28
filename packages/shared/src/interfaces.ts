export interface File {
  id: string;
  name: string;
  fileType: string;
  filePath: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  dateAdded: Date;
  yearPublished?: Date;
  coverImageUrl?: URL;
  file: File;
}

export interface BookFile {
  id: string;
  fileId: string;
  bookId: string;
}

import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Book } from 'src/user/entities/book.entity';
import { Like, Repository } from 'typeorm';
@Injectable()
export class BookService {
  private logger = new Logger();

  @InjectRepository(Book)
  private bookRepository: Repository<Book>;
   async findBookByPage(pageNo: number, pageSize: number){
    console.log('xxx');
      const skipCount = (pageNo - 1) * pageSize;
      const [book, totalCount] = await this.bookRepository.findAndCount({
          skip: skipCount,
          take: pageSize
      });
  
      return {
          book,
          totalCount
      }
  }

//   async findById(id: number) {
//     const [book ] = await this.bookRepository.findAndCount({
//       skip: 0,
//       take: 9999
//     });
//     return book.find(book => book.id === id);
// }

    async findById(id: number): Promise<Book> {
      const book = await this.bookRepository.findOneBy({ id });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      return book;
    }
   async create(createBookDto: CreateBookDto) {
    const findBook = await this.bookRepository.findOneBy({
      title: createBookDto.title
    });

    console.log('findBook', findBook);
    if(findBook) {
      throw new HttpException('该书本已添加', HttpStatus.BAD_REQUEST);
    }
      const newBook = new Book();
      newBook.title = createBookDto.title;
      newBook.author =createBookDto.author;
      newBook.description = createBookDto.description;
      newBook.cover = createBookDto.cover;
      try {
        await this.bookRepository.save(newBook);
        return '新增成功';
      } catch(e) {
        this.logger.error(e, BookService);
        return '新增失败';
      }
    }

   async update(updateBookDto: UpdateBookDto) {
      let id=updateBookDto.id
      const foundBook = await this.bookRepository.findOneBy({id});
      if (!foundBook) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      foundBook.author = updateBookDto.author;
      foundBook.cover = updateBookDto.cover;
      foundBook.description = updateBookDto.description;
      foundBook.title = updateBookDto.title;
      
      return await this.bookRepository.save(foundBook);
    }

    async deleteById(id: number){
      const book = await this.bookRepository.findOneBy({ id });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      try {
        await this.bookRepository.remove(book);
        return '删除成功';
      } catch(e) {
        this.logger.error(e, BookService);
        return '删除失败';
      }
    }
}

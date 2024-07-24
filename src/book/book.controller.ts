import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('list')
  async list(
      @Query('pageNo',new DefaultValuePipe(1),generateParseIntPipe('pageNo')) pageNo: number,
      @Query('pageSize', new DefaultValuePipe(10),generateParseIntPipe('pageSize')) pageSize: number,
  ) {
      return await this.bookService.findBookByPage(pageNo, pageSize);
}

  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log('+id', +id);
    return this.bookService.findById(+id);
  }

  @Post('create')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Post('update')
  async update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    return this.bookService.deleteById(+id);
  }
}

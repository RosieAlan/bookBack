import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('user_books')
export class UserBook {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  book_id: number;

  @ManyToOne(() => User, user => user.userBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, book => book.userBooks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}

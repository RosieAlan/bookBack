import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
    private logger = new Logger();

    @InjectRepository(User)
    private userRepository: Repository<User>;
    
    async register(user: RegisterUserDto) {
   
        const foundUser = await this.userRepository.findOneBy({
          username: user.username
        });
    
        if(foundUser) {
          throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
        }
    
        const newUser = new User();
        newUser.username = user.username;
        newUser.password = md5(user.password);
    
        try {
          await this.userRepository.save(newUser);
          return '注册成功';
        } catch(e) {
          this.logger.error(e, UserService);
          return '注册失败';
        }
    }
    

    async login(loginUserDto: LoginUserDto) {
      const users = await this.userRepository.findOneBy({
        username: loginUserDto.username
      });
      console.log('users', users);
  
      // const foundUser = users.find(item => item.username === loginUserDto.username);
  
      if(!users) {
          throw new BadGatewayException('用户不存在');
      }
  
      if(users.password !== md5(loginUserDto.password)) {
          throw new BadRequestException('密码不正确');
      }
  
      return users;
  }
  
}

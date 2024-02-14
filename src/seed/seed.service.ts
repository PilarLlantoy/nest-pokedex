import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeRes } from './interfaces/poke-res.interface';
//para usar axios corremos: yarn add axios@0.27.2 
//o npm install axios@0.27.2

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const {data}= await this.axios.get<PokeRes>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data.results.forEach( ({name,url}) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length-2];
    })
    return data.results;
  }
}

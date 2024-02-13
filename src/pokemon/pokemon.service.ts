import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll() {
    return this.pokemonModel;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(+term))//es un numero?: buscar por no
      pokemon = await this.pokemonModel.findOne({ no: term });
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: term });

    if (pokemon) return pokemon;
    else throw new NotFoundException(`Pokemon not found`);

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    let pokemon  = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    try{
      const newPokemon = await pokemon.updateOne(updatePokemonDto, {new:true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {
    /*const pokemon  = await this.findOne(id);
    await pokemon.deleteOne();*/
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount===0)
      throw new BadRequestException(`Pokemon not exists`)
    return;
  }

  private handleExceptions(error:any){
    if (error.code === 11000)
        throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    console.log(error);
    throw new InternalServerErrorException(`Cant create pokemon - check server logs`)
  }

}

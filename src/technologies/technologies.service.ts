import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; 
import { Technology } from './entities/technology.entity';
import { CreateTechnologyDto } from './dto/technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly techRepository: Repository<Technology>,
  ) {}

  /**
   * Crea una sola tecnología con normalización de nombre.
   */
  async create(createTechnologyDto: CreateTechnologyDto): Promise<Technology> {
    const name = createTechnologyDto.name.trim();
    
    // Normalización: Ej: "nOdE" -> "Node"
    const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    const existing = await this.techRepository.findOne({ 
      where: { name: normalizedName } 
    });

    if (existing) {
      throw new ConflictException(`La tecnología '${normalizedName}' ya está registrada.`);
    }

    const newTech = this.techRepository.create({ name: normalizedName });
    return await this.techRepository.save(newTech);
  }

  /**
   * Lista todas las tecnologías ordenadas alfabéticamente.
   */
  async findAll(): Promise<Technology[]> {
    return await this.techRepository.find({ order: { name: 'ASC' } });
  }

  /**
   * MÉTODO CLAVE: Busca o crea múltiples tecnologías a partir de un array de nombres.
   * Esto resuelve el error en VacanciesService y en los tests.
   */
  async findOrCreateMultiple(names: string[]): Promise<Technology[]> {
    if (!names || names.length === 0) return [];

    // 1. Normalizar todos los nombres recibidos para evitar duplicados por mayúsculas
    const normalizedNames = names.map(n => 
      n.trim().charAt(0).toUpperCase() + n.trim().slice(1).toLowerCase()
    );

    // 2. Buscar las que ya existen en la DB
    const existingTechs = await this.techRepository.find({
      where: { name: In(normalizedNames) },
    });

    const existingNames = existingTechs.map((t) => t.name);
    
    // 3. Filtrar cuáles de los nombres enviados NO están en la DB
    const newNames = normalizedNames.filter((n) => !existingNames.includes(n));

    // 4. Si hay nuevas, crearlas masivamente
    let savedNewTechs: Technology[] = [];
    if (newNames.length > 0) {
      const newTechsEntities = this.techRepository.create(
        newNames.map((name) => ({ name })),
      );
      savedNewTechs = await this.techRepository.save(newTechsEntities);
    }

    // 5. Devolver la unión de las que ya existían y las nuevas creadas
    return [...existingTechs, ...savedNewTechs];
  }

  /**
   * Busca tecnologías por sus IDs (Útil para validaciones externas).
   */
  async findByIds(ids: number[]): Promise<Technology[]> {
    return await this.techRepository.find({
      where: { id: In(ids) }
    });
  }
}
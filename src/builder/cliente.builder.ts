import { BusinessException } from '../exception/bussiness.exception';
import { Cliente, ClientePosta } from '../domain/cliente';
import { Promocion, SafeShop } from '../domain/condicion-comercial';

export class ClienteBuilder {
  constructor(private cliente: Cliente) {}

  safeShop(montoMaximo: number): ClienteBuilder {
    this.cliente = new SafeShop(montoMaximo, this.cliente);
    return this;
  }

  promocion(): ClienteBuilder {
    this.cliente = new Promocion(this.cliente);
    return this;
  }

  build(): Cliente {
    if (this.cliente.saldo() <= 0) {
      throw new BusinessException('El saldo debe ser positivo');
    }
    return this.cliente;
  }
}

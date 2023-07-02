import { BusinessException } from '../exception/bussiness.exception';
import { ClientePosta } from '../domain/cliente';
import { Promocion, SafeShop } from '../domain/condicion-comercial';

export class ClienteBuilder {
  constructor(private cliente: ClientePosta) {}

  safeShop(montoMaximo: number): ClienteBuilder {
    this.cliente.agregarCondicionComercial(new SafeShop(montoMaximo));
    return this;
  }

  promocion(): ClienteBuilder {
    this.cliente.agregarCondicionComercial(new Promocion());
    return this;
  }

  build(): ClientePosta {
    if (this.cliente.saldo() <= 0) {
      throw new BusinessException('El saldo debe ser positivo');
    }
    return this.cliente;
  }
}

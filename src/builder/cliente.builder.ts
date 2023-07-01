import { BusinessException } from '../exception/bussiness.exception';
import { ClientePosta } from '../domain/cliente';

export class ClienteBuilder {
  constructor(private cliente: ClientePosta) {}

  safeShop(montoMaximo: number): ClienteBuilder {
    this.cliente.adheridoSafeShop = true;
    this.cliente.montoMaximoSafeShop = montoMaximo;
    return this;
  }

  promocion(): ClienteBuilder {
    this.cliente.adheridoPromocion = true;
    return this;
  }

  build(): ClientePosta {
    if (this.cliente.saldo <= 0) {
      throw new BusinessException('El saldo debe ser positivo');
    }
    return this.cliente;
  }
}

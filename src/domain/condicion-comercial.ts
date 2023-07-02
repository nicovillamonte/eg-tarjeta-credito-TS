import { BusinessException } from '../exception/bussiness.exception';
import { Cliente } from './cliente';

export interface CondicionComercial {
  comprar(monto: number, cliente: Cliente): void;
  order(): number;
}

/*------------------------
  Safeshop
------------------------*/
export class SafeShop implements CondicionComercial {
  constructor(private montoMaximo: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  comprar(monto: number, cliente: Cliente): void {
    if (monto > this.montoMaximo) {
      throw new BusinessException(
        `Debe comprar por menos de ${this.montoMaximo}`,
      );
    }
  }

  order = () => 1;
}

/*------------------------
  Promocion
------------------------*/
export class Promocion implements CondicionComercial {
  static montoMinimoPromocion = 50;
  static PUNTAJE_PROMOCION = 15;

  comprar(monto: number, cliente: Cliente): void {
    if (monto > Promocion.montoMinimoPromocion) {
      cliente.sumarPuntos(Promocion.PUNTAJE_PROMOCION);
    }
  }

  order = () => 2;
}

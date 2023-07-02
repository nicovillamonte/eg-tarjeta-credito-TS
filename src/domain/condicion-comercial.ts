import { inherits } from 'util';
import { BusinessException } from '../exception/bussiness.exception';
import { Cliente, ClienteConCondicionComercial } from './cliente';

export interface CondicionComercial {
  comprar(monto: number, cliente: Cliente): void;
  order(): number;
}

/*------------------------
  Safeshop
------------------------*/
export class SafeShop extends ClienteConCondicionComercial {
  constructor(private montoMaximo: number, cliente: Cliente) {
    super(cliente);
  }

  override comprar(monto: number): void {
    if (monto > this.montoMaximo) {
      throw new BusinessException(
        `Debe comprar por menos de ${this.montoMaximo}`,
      );
    }
    super.comprar(monto);
  }

  order = () => 1;
}

/*------------------------
  Promocion
------------------------*/
export class Promocion extends ClienteConCondicionComercial {
  constructor(cliente: Cliente) {
    super(cliente);
  }

  static montoMinimoPromocion = 50;
  static PUNTAJE_PROMOCION = 15;

  override comprar(monto: number): void {
    super.comprar(monto);
    if (monto > Promocion.montoMinimoPromocion) {
      super.sumarPuntos(Promocion.PUNTAJE_PROMOCION);
    }
  }

  order = () => 2;
}

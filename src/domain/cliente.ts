import { BusinessException } from '../exception/bussiness.exception';

export interface Cliente {
  comprar(monto: number): void;
  pagarVencimiento(monto: number): void;
}

export class ClientePosta implements Cliente {
  montoMaximoSafeShop = 50;
  puntosPromocion = 0;
  adheridoPromocion = false;
  adheridoSafeShop = false;

  static montoMinimoPromocion = 50;
  static PUNTAJE_PROMOCION = 15;

  constructor(public saldo: number = 0) {}

  comprar(monto: number): void {
    if (this.adheridoSafeShop && monto > this.montoMaximoSafeShop) {
      throw new BusinessException(
        `Debe comprar por menos de ${this.montoMaximoSafeShop}`,
      );
    }

    this.saldo = this.saldo + monto;

    if (this.adheridoPromocion && monto > ClientePosta.montoMinimoPromocion) {
      this.puntosPromocion =
        this.puntosPromocion + ClientePosta.PUNTAJE_PROMOCION;
    }
  }

  pagarVencimiento(monto: number): void {
    this.saldo = this.saldo - monto;
  }

  esMoroso = () => this.saldo > 0;
}

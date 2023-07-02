export interface Cliente {
  saldo(): number;
  puntosPromocion(): number;
  comprar(monto: number): void;
  pagarVencimiento(monto: number): void;
  sumarPuntos(puntos: number): void;
  esMoroso(): boolean;
}

export class ClientePosta implements Cliente {
  private _puntosPromocion = 0;

  static montoMinimoPromocion = 50;
  static PUNTAJE_PROMOCION = 15;

  constructor(private _saldo: number = 0) {}

  comprar(monto: number): void {
    this._saldo = this._saldo + monto;
  }

  pagarVencimiento(monto: number): void {
    this._saldo = this._saldo - monto;
  }

  sumarPuntos = (puntos: number) => {
    this._puntosPromocion = this._puntosPromocion + puntos;
  };

  esMoroso = () => this._saldo > 0;

  puntosPromocion(): number {
    return this._puntosPromocion;
  }

  saldo(): number {
    return this._saldo;
  }
}

export abstract class ClienteConCondicionComercial implements Cliente {
  constructor(private cliente: Cliente) {}

  comprar(monto: number) {
    this.cliente.comprar(monto);
  }

  pagarVencimiento = (monto: number) => {
    this.cliente.pagarVencimiento(monto);
  };

  sumarPuntos(puntos: number) {
    this.cliente.sumarPuntos(puntos);
  }

  esMoroso = (): boolean => {
    return this.cliente.esMoroso();
  };

  saldo = () => {
    return this.cliente.saldo();
  };

  puntosPromocion = () => {
    return this.cliente.puntosPromocion();
  };
}

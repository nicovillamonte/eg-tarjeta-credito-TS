import { CondicionComercial } from './condicion-comercial';

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
  condicionesComerciales: Array<CondicionComercial> = [];

  static montoMinimoPromocion = 50;
  static PUNTAJE_PROMOCION = 15;

  constructor(private _saldo: number = 0) {}

  comprar(monto: number): void {
    this.condicionesComerciales
      .sort((a, b) => a.order() - b.order())
      .forEach((condicionComercial) => condicionComercial.comprar(monto, this));
    this._saldo = this._saldo + monto;
  }

  pagarVencimiento(monto: number): void {
    this._saldo = this._saldo - monto;
  }

  sumarPuntos = (puntos: number) => {
    this._puntosPromocion = this._puntosPromocion + puntos;
  };

  esMoroso = () => this._saldo > 0;

  agregarCondicionComercial = (condicionComercial: CondicionComercial) => {
    this.condicionesComerciales.push(condicionComercial);
  };

  puntosPromocion(): number {
    return this._puntosPromocion;
  }

  saldo(): number {
    return this._saldo;
  }
}

# Clientes de una Tarjeta de Crédito

Esta es una implementación del ejemplo de Tarjeta de Crédito implementado en NestJS con TypeScript.<br>
Solamente es una traducción de lenguaje del [ejemplo de Tarjeta de Crédito del docente Fernando Dodino](https://github.com/uqbar-project/eg-tarjeta-credito-kotlin/tree/01-builder) desarrollado en kotlin.<br><br>

La rama main contiene la implementación de Decorators.

## Dominio

El dominio esta explicado en [este apunte](https://docs.google.com/document/d/1Ijz8Pe-ci6bYwbxIn-VZDV1QcijDy2JuAUQtohNX0oA/edit#heading=h.30j0zll).

## Variante con decorators
Cada condición comercial se representa como una decorador del cliente. El cliente no sabe que lo decoran. Esto produce varios cambios:

### Cambios en el cliente
``` typescript
export interface Cliente {
  saldo(): number;
  puntosPromocion(): number;
  comprar(monto: number): void;
  pagarVencimiento(monto: number): void;
  sumarPuntos(puntos: number): void;
  esMoroso(): boolean;
}
```
La interfaz ya no define atributos `saldo` ni `puntosPromocion`, en la implementación de Kotlin lo transformamos en mensajes para que los decoradores no estén obligados a definirlos, sin embargo, en TypeScript de igual manera los tenemos que definir, sino nos arrojará un error. El cliente posta los implementa como getters:

``` typescript
export class ClientePosta implements Cliente {
  private _puntosPromocion = 0;
  constructor(private _saldo: number = 0) {}

  puntosPromocion(): number {
    return this._puntosPromocion;
  }

  saldo(): number {
    return this._saldo;
  }
}
```
Como ventaja, desaparecen atributos para manejar el monto máximo de safe shop y los flags por cada condición comercial.

### Implementación de las condiciones comerciales
Ambas condiciones toman la definición de una superclase común, que permite definir

* un constructor default que necesita el cliente
* la implementación de los mensajes de la interfaz `Cliente` que solamente delegan la responsabilidad al objeto decorado

``` typescript
export abstract class ClienteConCondicionComercial implements Cliente {
  constructor(private cliente: Cliente) {}

  comprar(monto: number) { this.cliente.comprar(monto); }

  pagarVencimiento = (monto: number) => { this.cliente.pagarVencimiento(monto); };

  sumarPuntos(puntos: number) { this.cliente.sumarPuntos(puntos); }

  esMoroso = (): boolean => this.cliente.esMoroso();

  saldo = () => this.cliente.saldo();

  puntosPromocion = () => this.cliente.puntosPromocion();
}
```

El código de la compra segura y de la promoción decoran la función comprar

* ahora son polimórficos respecto al cliente
* también delegan en el cliente la compra, pero no saben si el decorado es a su vez un decorador o el cliente posta
* antes o después de delegar agregan su funcionalidad, lo que permite que decoremos un objeto sin importarnos el orden en el que lo hacemos

``` typescript
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
```

### Cómo queda el método comprar de cliente
Como el cliente no sabe que lo decoran, volvemos a la versión donde solo se suma el saldo:
``` typescript
comprar(monto: number): void {
  this._saldo = this._saldo + monto;
}
```

### Cambios al builder
El builder es el encargado de envolver los decoradores cada vez que agreguemos la compra segura o la promoción:
``` typescript
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
```

### Cambios en los tests
El cambio en la interfaz cliente requiere que modifiquemos las preguntas por saldo o puntos de promoción como mensajes y no como propiedades:
``` typescript
it('Al comprar por arriba del límite de promoción y por debajo del safe shop, acumula puntos y la compra funciona ok', () => {
  cliente.comprar(60);
  expect(cliente.saldo()).toBe(110);
  expect(cliente.puntosPromocion()).toBe(15);
});
```

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm test
```


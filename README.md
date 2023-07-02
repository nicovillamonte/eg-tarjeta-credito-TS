# Clientes de una Tarjeta de Crédito

Esta es una implementación del ejemplo de Tarjeta de Crédito implementado en NestJS con TypeScript.<br>
Solamente es una traducción de lenguaje del [ejemplo de Tarjeta de Crédito del docente Fernando Dodino](https://github.com/uqbar-project/eg-tarjeta-credito-kotlin/tree/01-builder) desarrollado en kotlin.<br><br>

La rama actual contiene la implementación de la solución con strategy.

## Dominio

El dominio esta explicado en [este apunte](https://docs.google.com/document/d/1Ijz8Pe-ci6bYwbxIn-VZDV1QcijDy2JuAUQtohNX0oA/edit#heading=h.30j0zll).

## Variante con strategies
Cada condición comercial se representa como una estrategia dentro de la compra. Agregamos entonces una colección de condiciones comerciales en el cliente:

``` typescript
export class ClientePosta implements Cliente {
  private _puntosPromocion = 0;
  condicionesComerciales: Array<CondicionComercial> = [];
```
Como ventaja, desaparecen atributos para manejar el monto máximo de safe shop y los flags por cada condición comercial.

### Implementación de las condiciones comerciales
Tanto SafeShop como Promocion son clases que implementan la interfaz CondicionComercial:

``` typescript
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
```

Algunos comentarios:

* decidimos dejar los puntos de promoción dentro del cliente, para simplificar su uso (podés pensar qué pasaría si el test tuviera que conocer los puntos a través de la promoción directamente, cómo podría llegar a esa referencia sin pasar por el cliente)
* como consecuencia de esta última decisión, tuvimos que agregar un mensaje más en la interfaz Cliente:
``` typescript
export interface Cliente {
  ...
  sumarPuntos(puntos: number): void;
}
```
* también necesitamos establecer un orden para las condiciones comerciales, ya que no es lo mismo que primero esté la promoción y luego la compra segura que al revés. En el primer caso podría pasar que primero se sume puntos a una compra que en realidad no debería estar permitida.

### Cómo queda el método comprar
El método comprar debe incorporar la llamada a las condiciones comerciales antes de sumar el saldo:
``` typescript
comprar(monto: number): void {
  this.condicionesComerciales
    .sort((a, b) => a.order() - b.order())
    .forEach((condicionComercial) => condicionComercial.comprar(monto, this));
  this._saldo = this._saldo + monto;
}
```
Además como dijimos antes, hay que ordenar las condiciones comerciales para asegurarnos de que la compra segura tenga prioridad sobre las otras condiciones.

### Cambios al builder
El builder solo debe modificar la forma en la que se generan las condiciones comerciales:

``` typescript
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
```
### Los tests quedan igual

Gracias al diseño del ClienteBuilder, no debemos hacer ningún cambio en los tests y éstos pasan satisfactoriamente.

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm run test
```


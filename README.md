# Clientes de una Tarjeta de Crédito

Esta es una implementación del ejemplo de Tarjeta de Crédito implementado en NestJS con TypeScript.<br>
Solamente es una traducción de lenguaje del [ejemplo de Tarjeta de Crédito del docente Fernando Dodino](https://github.com/uqbar-project/eg-tarjeta-credito-kotlin/tree/01-builder) desarrollado en kotlin.<br><br>

La rama main contiene la implementación de la solución utilizando if.

## Dominio

El dominio esta explicado en [este apunte](https://docs.google.com/document/d/1Ijz8Pe-ci6bYwbxIn-VZDV1QcijDy2JuAUQtohNX0oA/edit#heading=h.30j0zll).

## Definiendo una interfaz más rica
Queremos que la interfaz de Cliente
- tenga una definición de moroso (No posible en interfaces de TypeScript)
- y defina propiedades saldo y puntosPromocion

A diferencia de Kotlin, en TypeScript no podemos definir las funciones de una interfaz, solamente declararlas. Por lo tanto no se puede definir el código default de esMoroso() en la interfaz, sino que se debe definir en la clase que implementa la interfaz. Esto es una limitación de TypeScript frente a Kotlin.

``` typescript
export interface Cliente {
  saldo: number;
  puntosPromocion: number;

  comprar(monto: number): void;
  pagarVencimiento(monto: number): void;

  esMoroso(): boolean; // No se puede definir
}
```

## Creando clientes con un builder

Otra idea que permite simplificar la instanciación de un cliente es la utilización de un builder u objeto que sabe construir un cliente. Por el momento pareciera un caso de sobrediseño, pero a priori nos permite ahorrar la sincronización de los booleanos `adheridoSafeShop` y `adheridoPromocion`.

El builder tiene como característica
- recibir un cliente
- tener métodos que permiten agregar condiciones comerciales, y en cada uno de ellos se devuelve el propio builder. Eso permite encadenar los mensajes en los tests
- por último, en el método `build()` se pueden hacer validaciones asegurando la consistencia del objeto creado

Vemos el código

``` typescript
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
```

Por otra parte el uso en el test que trabaja con un cliente con las dos condiciones comerciales es:

``` typescript
cliente = new ClienteBuilder(new ClientePosta(50))
            .promocion()
            .safeShop(montoMaximoSafeShopCliente)
            .build()
```

Más adelante esta definición nos será muy útil.

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm run test
```


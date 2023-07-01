import { BusinessException } from '../../src/exception/bussiness.exception';
import { Cliente, ClientePosta } from '../../src/domain/cliente';
import { ClienteBuilder } from '../../src/builder/cliente.builder';

describe('Dado un cliente que tiene tanto safe shop como promoción como condiciones comerciales', () => {
  const montoMaximoSafeShopCliente = 80;
  let cliente!: Cliente;

  beforeEach(() => {
    cliente = new ClienteBuilder(new ClientePosta(50))
      .promocion()
      .safeShop(montoMaximoSafeShopCliente)
      .build();
  });

  it('Al comprar por arriba del límite de promoción y por debajo del safe shop, acumula puntos y la compra funciona ok', () => {
    cliente.comprar(60);
    expect(cliente.saldo).toBe(110);
    expect(cliente.puntosPromocion).toBe(15);
  });

  it('Al comprar por arriba del límite de safe shop, la compra se cancela y no acumula puntos', () => {
    expect(() => cliente.comprar(montoMaximoSafeShopCliente + 1)).toThrow(
      BusinessException,
    );
    expect(cliente.saldo).toBe(50);
    expect(cliente.puntosPromocion).toBe(0);
  });
});

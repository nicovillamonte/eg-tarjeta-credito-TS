import { ClienteBuilder } from '../../src/builder/cliente.builder';
import { Cliente, ClientePosta } from '../../src/domain/cliente';

describe('Dado un cliente que tiene únicamente promoción como condición comercial', () => {
  let cliente!: Cliente;

  beforeEach(() => {
    cliente = new ClienteBuilder(new ClientePosta(40)).promocion().build();
  });

  it('al comprar por debajo del límite necesario para acumular puntos, no acumula puntos de promoción', () => {
    cliente.comprar(50);
    expect(cliente.puntosPromocion).toBe(0);
  });

  it('al comprar por arriba del monto necesario para acumular puntos, acumula puntos de promoción', () => {
    cliente.comprar(60);
    expect(cliente.puntosPromocion).toBe(15);
  });
});

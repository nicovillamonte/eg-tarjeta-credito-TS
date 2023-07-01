import { ClienteBuilder } from '../../src/builder/cliente.builder';
import { Cliente, ClientePosta } from '../../src/domain/cliente';

describe('Dado un cliente sin condiciones comerciales', () => {
  let cliente!: Cliente;

  beforeEach(() => {
    cliente = new ClienteBuilder(new ClientePosta(50)).build();
  });

  it('al pagar el vencimiento deja de ser moroso', () => {
    expect(cliente.esMoroso()).toBeTruthy();
    cliente.pagarVencimiento(50);
    expect(cliente.esMoroso()).toBeFalsy();
  });

  it('al comprar sube el saldo', () => {
    cliente.comprar(50);
    expect(cliente.saldo).toBe(100);
  });
});

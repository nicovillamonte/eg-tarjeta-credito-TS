import { ClientePosta } from './cliente';

describe('Dado un cliente que tiene únicamente safe shop como condición comercial', () => {
  const montoMaximoSafeShopCliente = 30;
  let cliente!: ClientePosta;

  beforeEach(() => {
    cliente = new ClientePosta(50);
    cliente.adheridoSafeShop = true;
    cliente.montoMaximoSafeShop = montoMaximoSafeShopCliente;
  });

  it('no debe poder comprar por más del valor permitido ni debe aumentar el saldo', () => {
    expect(() => cliente.comprar(montoMaximoSafeShopCliente + 1)).toThrow(
      'Debe comprar por menos de 30',
    );
    expect(cliente.saldo).toBe(50);
  });

  it('debe poder comprar hasta el valor límite', () => {
    cliente.comprar(montoMaximoSafeShopCliente);
    expect(cliente.saldo).toBe(50 + montoMaximoSafeShopCliente);
  });
});

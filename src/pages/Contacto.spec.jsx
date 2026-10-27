import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Contacto from './Contacto';

describe('Contacto', () => {
  afterEach(cleanup);

  it('al escribir en el campo nombre, el valor queda en el input (formulario controlado)', () => {
    render(<Contacto />);
    const campo = screen.getByLabelText('Nombre');
    fireEvent.change(campo, { target: { value: 'Vicente' } });
    expect(campo.value).toBe('Vicente');
  });

  it('al enviar muestra la confirmación y limpia el formulario', () => {
    render(<Contacto />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Vicente' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'v@correo.cl' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Hola' } });
    fireEvent.submit(screen.getByLabelText('Nombre').closest('form'));
    expect(screen.getByText(/Gracias por escribirnos/)).toBeTruthy();
    expect(screen.getByLabelText('Nombre').value).toBe('');
  });

  it('no muestra la confirmación antes de enviar', () => {
    render(<Contacto />);
    expect(screen.queryByText(/Gracias por escribirnos/)).toBeNull();
  });
});

import { useState } from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DireccionFields from './DireccionFields';

// Componente padre de prueba: guarda los valores igual que lo hacen
// Registro y Comprar, y le pasa a DireccionFields las props.
function Padre({ alCambiar }) {
  const [valores, setValores] = useState({
    calle: '', departamento: '', region: '', comuna: '', indicaciones: '',
  });
  function cambiar(nombre, valor) {
    alCambiar(nombre, valor);
    setValores((anterior) => ({ ...anterior, [nombre]: valor }));
  }
  return <DireccionFields valores={valores} onCambiar={cambiar} />;
}

function opcionesDeComuna() {
  return screen.getByLabelText(/Comuna/).querySelectorAll('option');
}

describe('DireccionFields', () => {
  afterEach(cleanup);

  it('la comuna parte deshabilitada hasta elegir una región', () => {
    render(<Padre alCambiar={() => {}} />);
    expect(screen.getByLabelText(/Comuna/).disabled).toBeTrue();
  });

  it('al elegir una región se habilitan solo las comunas de esa región', () => {
    render(<Padre alCambiar={() => {}} />);
    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: '1000' } });
    expect(screen.getByLabelText(/Comuna/).disabled).toBeFalse();
    // 1 opción "Selecciona una comuna" + las comunas de la región 1000
    expect(opcionesDeComuna().length).toBeGreaterThan(1);
    expect(screen.getByText('Cerrillos')).toBeTruthy();
    expect(screen.queryByText('Arica')).toBeNull();
  });

  it('al cambiar la región avisa al padre y borra la comuna elegida (props + eventos)', () => {
    const alCambiar = jasmine.createSpy('alCambiar');
    render(<Padre alCambiar={alCambiar} />);
    fireEvent.change(screen.getByLabelText(/Región/), { target: { value: '1000' } });
    expect(alCambiar).toHaveBeenCalledWith('region', '1000');
    expect(alCambiar).toHaveBeenCalledWith('comuna', '');
  });

  it('al escribir la calle avisa al padre con el nombre del campo y el valor', () => {
    const alCambiar = jasmine.createSpy('alCambiar');
    render(<Padre alCambiar={alCambiar} />);
    fireEvent.change(screen.getByLabelText(/Calle/), { target: { value: 'Av. Siempre Viva 123' } });
    expect(alCambiar).toHaveBeenCalledWith('calle', 'Av. Siempre Viva 123');
  });
});

class Usuarios {
  // id: string
  // nombre: string
  // sala: string

  constructor() {
    this.personas = []; // Conectadas en el chat
  }

  agregarPersona(id, nombre, sala) {
    let persona = {
      id,
      nombre,
      sala,
    };
    this.personas.push(persona);
    return this.personas;
  }

  getPersona(id) {
    let persona = this.personas.filter((per) => per.id === id)[0];
    return persona;
  }

  getPersonas() {
    return this.personas;
  }

  getPersonaPorSala(sala) {
    return this.personas.filter((per) => per.sala === sala);
  }

  borrarPersona(id) {
    let personaBorrada = this.getPersona(id);
    this.personas = this.personas.filter((per) => per.id != id);
    return personaBorrada;
  }
}

module.exports = Usuarios;

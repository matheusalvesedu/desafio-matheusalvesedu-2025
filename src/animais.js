import { BRINQUEDOS } from "./constants.js";

class Animais {

    constructor(nome, especie, brinquedos, precisaCompanhia = false) {
        this._nome = nome;
        this._especie = especie.toUpperCase();
        this._brinquedos = brinquedos.map(b => {
            const caps = b.toUpperCase();
            if (!BRINQUEDOS[caps]) {
                throw new Error(`Brinquedo inválido: ${b}`);
            }
            return caps;
        });
        this._precisaCompanhia = precisaCompanhia;
    }

    static inicializarAnimais() {
        return {
            Rex: new Animais("Rex", "CACHORRO", ["RATO", "BOLA"]),
            Mimi: new Animais("Mimi", "GATO", ["BOLA", "LASER"]),
            Fofo: new Animais("Fofo", "GATO", ["BOLA", "RATO", "LASER"]),
            Zero: new Animais("Zero", "GATO", ["RATO", "BOLA"]),
            Bola: new Animais("Bola", "CACHORRO", ["CAIXA", "NOVELO"]),
            Bebe: new Animais("Bebe", "CACHORRO", ["LASER", "RATO", "BOLA"]),
            Loco: new Animais("Loco", "JABUTI", ["SKATE", "RATO"], true)
        };
    }

    get especie() {
        return this._especie;
    }

    get brinquedos() {
        return this._brinquedos;
    }

    get nome() {
        return this._nome;
    }
}

export { Animais };

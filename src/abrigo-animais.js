import { Animais } from "./animais.js";
import { ERROS } from "./constants.js";

class AbrigoAnimais {
  constructor() {
    this.abrigo = Animais.inicializarAnimais();
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    let resultado = {};

    try {
      const listaBrinquedosPessoa1 = this.preparaBrinquedos(brinquedosPessoa1);
      const listaBrinquedosPessoa2 = this.preparaBrinquedos(brinquedosPessoa2);
      const listaAnimais = this.preparaAnimais(ordemAnimais);

      resultado = this.realizaAdocao(listaBrinquedosPessoa1, listaBrinquedosPessoa2, listaAnimais);

      resultado = this.verificaResultado(resultado);

      return {
        lista: [...resultado.lista].sort((a, b) => {
          const nomeA = a.split(" - ")[0];
          const nomeB = b.split(" - ")[0];
          return nomeA.localeCompare(nomeB);
        }),
        erro: false
      };

    } catch (err) {
      if (err.message === ERROS.ANIMAL) {
        return { erro: 'Animal inválido' };
      }
      if (err.message === ERROS.BRINQUEDO) {
        return { erro: 'Brinquedo inválido' };
      }
      return { erro: err.message };
    }
  }

  preparaBrinquedos(brinquedos) {
    const lista = this.padronizaListaBrinquedos(brinquedos);
    this.verificaDuplicadoBrinquedos(lista);
    return lista;
  }

  preparaAnimais(animais) {
    const lista = this.padronizaListaAnimais(animais);
    this.verificaDuplicadoAnimais(lista);
    this.verificarAnimais(lista);
    return lista;
  }

  verificarAnimais(listaAnimais) {
    for (const animal of listaAnimais) {
      if (!this.abrigo[animal]) {
        throw new Error(ERROS.ANIMAL);
      }
    }
  }

  verificaDuplicadoAnimais(animais) {
    if (new Set(animais).size !== animais.length) {
      throw new Error(ERROS.ANIMAL);
    }
  }

  verificaDuplicadoBrinquedos(brinquedos) {
    if (new Set(brinquedos).size !== brinquedos.length) {
      throw new Error(ERROS.BRINQUEDO);
    }
  }

  padronizaListaBrinquedos(brinquedos) {
    if (!brinquedos || typeof brinquedos !== "string" || brinquedos.trim() === "") {
      return [];
    }
    const lista = brinquedos.split(",").map(b => b.trim().toUpperCase());
    // Verificar se há elementos vazios após o trim
    if (lista.some(b => b === "")) {
      throw new Error(ERROS.BRINQUEDO);
    }
    return lista;
  }

  padronizaListaAnimais(animais) {
    if (!animais || typeof animais !== "string" || animais.trim() === "") {
      return [];
    }
    const lista = animais.split(",").map(a => a.trim());
    // Verificar se há elementos vazios após o trim
    if (lista.some(a => a === "")) {
      throw new Error(ERROS.ANIMAL);
    }
    return lista;
  }

  validaBrinquedoAnimal(brinquedosPessoa, animal) {
    const animalObj = this.abrigo[animal];
    const brinquedosAnimal = animalObj.brinquedos;
    let i = 0;

    for (const brinquedo of brinquedosPessoa) {
      if (brinquedo === brinquedosAnimal[i]) {
        i++;
      }
      if (i === brinquedosAnimal.length) return true;
    }
    return false;
  }

  validaBrinquedoLocoSemOrdem(brinquedosPessoa) {
    const brinquedosLoco = this.abrigo['Loco'].brinquedos;
    const contagemBrinquedosPessoa = this.contarBrinquedos(brinquedosPessoa);
    const contagemBrinquedosLoco = this.contarBrinquedos(brinquedosLoco);
    for (const brinquedo in contagemBrinquedosLoco) {
      if ((contagemBrinquedosPessoa[brinquedo] || 0) < contagemBrinquedosLoco[brinquedo]) {
        return false;
      }
    }
    return true;
  }

  contarBrinquedos(listaBrinquedos) {
    const contagem = {};
    for (const brinquedo of listaBrinquedos) {
      contagem[brinquedo] = (contagem[brinquedo] || 0) + 1;
    }
    return contagem;
  }

  // Novo método para consumir os brinquedos da pessoa
  consomeBrinquedos(brinquedosPessoa, animal) {
    const brinquedosAnimal = this.abrigo[animal].brinquedos;
    let inventarioRestante = [...brinquedosPessoa];

    for (const brinquedoAnimal of brinquedosAnimal) {
      const index = inventarioRestante.indexOf(brinquedoAnimal);
      if (index !== -1) {
        inventarioRestante.splice(index, 1);
      }
    }
    return inventarioRestante;
  }

  // Novo método para verificar se uma pessoa pode adotar considerando o consumo de brinquedos
  podeAdotarAnimal(inventarioPessoa, animal, jaAdotados) {
    const animalObj = this.abrigo[animal];

    // Regra do Loco: a ordem só não importa se já tiver um companheiro
    if (animal === 'Loco' && jaAdotados > 0) {
      return this.validaBrinquedoLocoSemOrdem(inventarioPessoa);
    } else {
      return this.validaBrinquedoAnimal(inventarioPessoa, animal);
    }
  }

  realizaAdocao(brinquedosPessoa1, brinquedosPessoa2, listaAnimais) {
    const MAX_ANIMAIS = 3;
    let adotadosPessoa1 = 0;
    let adotadosPessoa2 = 0;
    const listaFinal = [];
    let inventarioPessoa1 = [...brinquedosPessoa1];
    let inventarioPessoa2 = [...brinquedosPessoa2];

    // Rastrear brinquedos usados por cada pessoa
    let brinquedosUsadosPessoa1 = [];
    let brinquedosUsadosPessoa2 = [];

    for (const animal of listaAnimais) {
      const animalObj = this.abrigo[animal];
      let statusAdocao = `${animal} - abrigo`;

      // Verificar se cada pessoa pode adotar o animal (verificando limite primeiro)
      let podeAdotar1 = (adotadosPessoa1 < MAX_ANIMAIS) &&
        this.podeAdotarAnimal(inventarioPessoa1, animal, adotadosPessoa1);
      let podeAdotar2 = (adotadosPessoa2 < MAX_ANIMAIS) &&
        this.podeAdotarAnimal(inventarioPessoa2, animal, adotadosPessoa2);

      // Regra dos gatos: gatos não dividem brinquedos
      if (animalObj.especie.toUpperCase() === 'GATO') {
        // Verificar se algum brinquedo que o gato precisa já foi usado
        const brinquedosGato = animalObj.brinquedos;

        if (podeAdotar1) {
          const temBrinquedoUsado = brinquedosGato.some(brinquedo =>
            brinquedosUsadosPessoa1.includes(brinquedo)
          );
          if (temBrinquedoUsado) {
            podeAdotar1 = false; // Gato se recusa a dividir
          }
        }

        if (podeAdotar2) {
          const temBrinquedoUsado = brinquedosGato.some(brinquedo =>
            brinquedosUsadosPessoa2.includes(brinquedo)
          );
          if (temBrinquedoUsado) {
            podeAdotar2 = false; // Gato se recusa a dividir
          }
        }
      }

      // Regra de conflito: se ambos podem adotar, animal fica no abrigo
      if (podeAdotar1 && podeAdotar2) {
        statusAdocao = `${animal} - abrigo`;
      } else if (podeAdotar1) {
        // Pessoa 1 adota
        adotadosPessoa1++;
        statusAdocao = `${animal} - pessoa 1`;

        // Adicionar brinquedos do animal aos brinquedos usados
        brinquedosUsadosPessoa1.push(...animalObj.brinquedos);

        // Se for um gato, consome os brinquedos do inventário
        if (animalObj.especie.toUpperCase() === 'GATO') {
          inventarioPessoa1 = this.consomeBrinquedos(inventarioPessoa1, animal);
        }
      } else if (podeAdotar2) {
        // Pessoa 2 adota
        adotadosPessoa2++;
        statusAdocao = `${animal} - pessoa 2`;

        // Adicionar brinquedos do animal aos brinquedos usados
        brinquedosUsadosPessoa2.push(...animalObj.brinquedos);

        // Se for um gato, consome os brinquedos do inventário
        if (animalObj.especie.toUpperCase() === 'GATO') {
          inventarioPessoa2 = this.consomeBrinquedos(inventarioPessoa2, animal);
        }
      }

      listaFinal.push(statusAdocao);
    }

    return {
      lista: listaFinal,
      adotadosPessoa1: adotadosPessoa1,
      adotadosPessoa2: adotadosPessoa2
    };
  }

  verificaResultado(resultado) {
    let listaFinal = [...resultado.lista];

    const locoIndex = listaFinal.findIndex(a => a.startsWith('Loco'));

    if (locoIndex !== -1) {
      const locoStatus = listaFinal[locoIndex];
      const donoLoco = locoStatus.split(' - ')[1];

      if (donoLoco === 'pessoa 1' && resultado.adotadosPessoa1 === 1) {
        listaFinal[locoIndex] = 'Loco - abrigo';
      } else if (donoLoco === 'pessoa 2' && resultado.adotadosPessoa2 === 1) {
        listaFinal[locoIndex] = 'Loco - abrigo';
      }
    }

    return {
      lista: listaFinal
    };
  }
}

export { AbrigoAnimais };
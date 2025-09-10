import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais - Casos de Teste Abrangentes', () => {

  // ============= CASOS BÁSICOS DE SUCESSO =============
  test('Deve encontrar pessoa para um único animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', '', 'Rex');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoas diferentes para animais diferentes', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'CAIXA,NOVELO', 'Rex,Bola');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Bola - pessoa 2');
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve lidar com entradas completamente vazias', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('', '', '');
    expect(resultado.lista.length).toBe(0);
    expect(resultado.erro).toBeFalsy();
  });

  // ============= REGRA DE INTERCALAÇÃO =============
  test('Deve adotar animal com brinquedos intercalados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,NOVELO,LASER', '', 'Mimi');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Mimi - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve rejeitar animal quando brinquedos estão fora de ordem', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('LASER,BOLA', '', 'Mimi'); // Mimi precisa BOLA,LASER
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Mimi - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  // ============= REGRA DE CONFLITO =============
  test('Animal deve ir para o abrigo se ambas as pessoas puderem adotá-lo', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Rex - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  test('Múltiplos conflitos - todos os animais vão para o abrigo', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,LASER', 'RATO,BOLA,LASER', 'Rex,Mimi');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Mimi - abrigo');
    expect(resultado.lista[1]).toBe('Rex - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  // ============= REGRA DOS GATOS =============
  test('Gato no final da fila deve ser rejeitado se brinquedos já foram usados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('rato, bola, laser', '', 'Rex,Mimi');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Mimi - abrigo'); // Mimi rejeitado porque Rex usou BOLA
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Primeiro gato deve ser adotado normalmente', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('bola, laser, rato', '', 'Mimi,Rex');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Mimi - pessoa 1'); // Mimi adotado primeiro
    expect(resultado.lista[1]).toBe('Rex - abrigo'); // Rex rejeitado porque Mimi consumiu BOLA
    expect(resultado.erro).toBeFalsy();
  });

  test('Gatos consecutivos - apenas o primeiro é adotado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('bola, laser, rato', '', 'Mimi,Zero');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Mimi - pessoa 1'); // Mimi adotado
    expect(resultado.lista[1]).toBe('Zero - abrigo'); // Zero rejeitado (gatos não dividem)
    expect(resultado.erro).toBeFalsy();
  });

  test('Gato consome brinquedos do inventário', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('bola, laser', '', 'Mimi,Rex');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Mimi - pessoa 1'); // Mimi consome BOLA e LASER
    expect(resultado.lista[1]).toBe('Rex - abrigo'); // Rex não tem brinquedos restantes
    expect(resultado.erro).toBeFalsy();
  });

  // ============= REGRA DO LOCO =============
  test('Loco deve ser adotado com companheiro (ordem não importa)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,SKATE', '', 'Rex,Loco');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Loco - pessoa 1'); // Loco com companheiro
    expect(resultado.lista[1]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test('Loco deve ser rejeitado se for o único animal adotado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,SKATE', 'BOLA,RATO,LASER', 'Loco,Fofo');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Fofo - pessoa 2');
    expect(resultado.lista[1]).toBe('Loco - abrigo'); // Loco sem companheiro
    expect(resultado.erro).toBeFalsy();
  });

  test('Loco deve respeitar ordem quando é o único (sem companheiro)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('SKATE,RATO', '', 'Loco'); // Ordem errada
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Loco - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  test('Loco com ordem correta mas sem companheiro ainda é rejeitado', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('SKATE,RATO', 'BOLA', 'Loco,Mimi');
    expect(resultado.lista.length).toBe(2);
    expect(resultado.lista[0]).toBe('Loco - abrigo'); // Sem companheiro na pessoa 1
    expect(resultado.lista[1]).toBe('Mimi - abrigo'); // Não tem BOLA,LASER
    expect(resultado.erro).toBeFalsy();
  });

  // ============= CASOS COMPLEXOS =============
  test('Cenário complexo: gatos, limites e conflitos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,RATO,CAIXA,NOVELO',
      'RATO,BOLA,LASER,CAIXA,NOVELO',
      'Rex,Mimi,Fofo,Bola'
    );
    expect(resultado.lista.length).toBe(4);
    expect(resultado.lista[0]).toBe('Bola - abrigo'); // Conflito (ambos podem adotar)
    expect(resultado.lista[1]).toBe('Fofo - abrigo'); // Gatos não dividem brinquedos
    expect(resultado.lista[2]).toBe('Mimi - abrigo'); // Primeiro gato
    expect(resultado.lista[3]).toBe('Rex - pessoa 2'); // Conflito
    expect(resultado.erro).toBeFalsy();
  });

  test('Cenário com Loco, gatos e limites', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,SKATE,CAIXA,NOVELO',
      '',
      'Mimi,Rex,Loco,Bola'
    );
    expect(resultado.lista.length).toBe(4);
    expect(resultado.lista[0]).toBe('Bola - pessoa 1'); // Último animal dentro do limite
    expect(resultado.lista[1]).toBe('Loco - pessoa 1'); // Com companheiros
    expect(resultado.lista[2]).toBe('Mimi - pessoa 1'); // Primeiro
    expect(resultado.lista[3]).toBe('Rex - abrigo'); // Rex não pode usar BOLA (Mimi consumiu)
    expect(resultado.erro).toBeFalsy();
  });

  // ============= VALIDAÇÃO DE ENTRADA =============
  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', '', 'Rex,AnimalInexistente');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar animais duplicados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', '', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar brinquedos duplicados', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,RATO', '', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar elementos vazios em brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,,BOLA', '', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve rejeitar elementos vazios em animais', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', '', 'Rex,,Mimi');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve lidar com espaços extras corretamente', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(' RATO , BOLA ', '', ' Rex ');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  // ============= CASOS EXTREMOS =============
  test('Pessoa sem brinquedos não pode adotar nenhum animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('', 'RATO,BOLA', 'Rex');
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Rex - pessoa 2');
    expect(resultado.erro).toBeFalsy();
  });

  test('Animal que ninguém pode adotar vai para o abrigo', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('LASER', 'CAIXA', 'Rex'); // Rex precisa RATO,BOLA
    expect(resultado.lista.length).toBe(1);
    expect(resultado.lista[0]).toBe('Rex - abrigo');
    expect(resultado.erro).toBeFalsy();
  });

  test('Ordenação alfabética está funcionando', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,LASER,CAIXA,NOVELO', '', 'Zero,Rex,Mimi');
    expect(resultado.lista.length).toBe(3);
    expect(resultado.lista[0]).toBe('Mimi - abrigo');
    expect(resultado.lista[1]).toBe('Rex - abrigo');
    expect(resultado.lista[2]).toBe('Zero - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });

  test(("4 animais sendo adotados pelas mesmas pessoas, "), () => {
    const resultado = new AbrigoAnimais().encontraPessoas('LASER, RATO,BOLA,CAIXA,NOVELO,SKATE', '', 'Rex, Loco, Bebe, Bola');
    expect(resultado.lista.length).toBe(4);
    expect(resultado.lista[0]).toBe('Bebe - pessoa 1');
    expect(resultado.lista[1]).toBe('Bola - abrigo');
    expect(resultado.lista[2]).toBe('Loco - pessoa 1');
    expect(resultado.lista[3]).toBe('Rex - pessoa 1');
    expect(resultado.erro).toBeFalsy();
  });


});
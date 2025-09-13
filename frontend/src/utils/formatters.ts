// Utilitários para formatação de dados

/**
 * Formatar CPF
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (000.000.000-00)
 */
export const formatarCPF = (cpf: string): string => {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  // Aplica a máscara conforme o usuário digita
  if (cpfLimpo.length <= 3) {
    return cpfLimpo;
  } else if (cpfLimpo.length <= 6) {
    return cpfLimpo.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  } else if (cpfLimpo.length <= 9) {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }
};

/**
 * Remover formatação do CPF
 * @param cpf - CPF formatado
 * @returns CPF apenas com números
 */
export const limparCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Validar CPF
 * @param cpf - CPF com ou sem formatação
 * @returns true se o CPF é válido
 */
export const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = limparCPF(cpf);
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
  
  // Segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  
  return true;
};

/**
 * Formatar RG
 * @param rg - RG sem formatação
 * @returns RG formatado
 */
export const formatarRG = (rg: string): string => {
  // Remove caracteres não alfanuméricos
  const rgLimpo = rg.replace(/[^\dxX]/g, '');
  
  if (rgLimpo.length <= 2) {
    return rgLimpo;
  } else if (rgLimpo.length <= 5) {
    return rgLimpo.replace(/(\d{2})(\d{1,3})/, '$1.$2');
  } else if (rgLimpo.length <= 8) {
    return rgLimpo.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else {
    return rgLimpo.replace(/(\d{2})(\d{3})(\d{3})(\w{1})/, '$1.$2.$3-$4');
  }
};

/**
 * Formatar telefone
 * @param telefone - Telefone sem formatação
 * @returns Telefone formatado
 */
export const formatarTelefone = (telefone: string): string => {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  if (telefoneLimpo.length <= 2) {
    return telefoneLimpo;
  } else if (telefoneLimpo.length <= 6) {
    return telefoneLimpo.replace(/(\d{2})(\d{1,4})/, '($1) $2');
  } else if (telefoneLimpo.length <= 10) {
    return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
  } else {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
};

/**
 * Formatar data para exibição
 * @param data - Data no formato ISO (YYYY-MM-DD)
 * @returns Data formatada (DD/MM/YYYY)
 */
export const formatarData = (data: string): string => {
  if (!data) return '';
  const date = new Date(data + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
};

/**
 * Calcular idade
 * @param dataNascimento - Data de nascimento no formato ISO
 * @returns Idade em anos
 */
export const calcularIdade = (dataNascimento: string): number => {
  if (!dataNascimento) return 0;
  
  const hoje = new Date();
  const nascimento = new Date(dataNascimento + 'T00:00:00');
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

/**
 * Calcular IMC
 * @param peso - Peso em kg
 * @param altura - Altura em cm
 * @returns IMC formatado com 1 casa decimal
 */
export const calcularIMC = (peso: number, altura: number): string => {
  if (!peso || !altura || peso <= 0 || altura <= 0) return '';
  
  const alturaMetros = altura / 100;
  const imc = peso / (alturaMetros * alturaMetros);
  
  return imc.toFixed(1);
};

/**
 * Classificar IMC
 * @param imc - Valor do IMC
 * @returns Classificação do IMC
 */
export const classificarIMC = (imc: number): string => {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade grau I';
  if (imc < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
};

// Validações para formulários

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefone = (telefone) => {
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  // Verifica se tem 10 ou 11 dígitos (com ou sem DDD)
  return numeros.length >= 10 && numeros.length <= 11;
};

export const validarSenha = (senha) => {
  // Mínimo 6 caracteres
  return senha.length >= 6;
};

export const validarNome = (nome) => {
  // Mínimo 3 caracteres, apenas letras e espaços
  return nome.trim().length >= 3 && /^[a-záàâãéèêíïóôõöúçñ\s]+$/i.test(nome);
};

export const formatarTelefone = (telefone) => {
  // Remove tudo que não for número
  const numeros = telefone.replace(/\D/g, '');
  
  // Formata (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

export const formatarCPF = (cpf) => {
  // Remove tudo que não for número
  const numeros = cpf.replace(/\D/g, '');
  
  // Formata XXX.XXX.XXX-XX
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

export const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
  
  if (digitoVerificador1 !== parseInt(numeros.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
  
  return digitoVerificador2 === parseInt(numeros.charAt(10));
};

export const validarData = (data) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataSelecionada = new Date(data + 'T00:00:00');
  
  // Data não pode ser no passado
  return dataSelecionada >= hoje;
};

export const validarHorario = (horario) => {
  // Formato HH:MM
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(horario);
};

export const getMensagemErro = (campo, valor) => {
  switch (campo) {
    case 'nome':
      if (!valor || valor.trim().length === 0) {
        return 'Nome é obrigatório';
      }
      if (!validarNome(valor)) {
        return 'Nome deve ter no mínimo 3 letras';
      }
      break;
      
    case 'email':
      if (!valor || valor.trim().length === 0) {
        return 'Email é obrigatório';
      }
      if (!validarEmail(valor)) {
        return 'Email inválido';
      }
      break;
      
    case 'telefone':
      if (!valor || valor.trim().length === 0) {
        return 'Telefone é obrigatório';
      }
      if (!validarTelefone(valor)) {
        return 'Telefone inválido (use DDD + número)';
      }
      break;
      
    case 'senha':
      if (!valor || valor.length === 0) {
        return 'Senha é obrigatória';
      }
      if (!validarSenha(valor)) {
        return 'Senha deve ter no mínimo 6 caracteres';
      }
      break;
      
    case 'confirmarSenha':
      if (!valor || valor.length === 0) {
        return 'Confirme a senha';
      }
      break;
      
    case 'cpf':
      if (valor && !validarCPF(valor)) {
        return 'CPF inválido';
      }
      break;
      
    default:
      return null;
  }
  
  return null;
};

export const validarFormulario = (dados, camposObrigatorios = []) => {
  const erros = {};
  
  // Valida campos obrigatórios
  camposObrigatorios.forEach(campo => {
    if (!dados[campo] || dados[campo].toString().trim().length === 0) {
      erros[campo] = `${campo.charAt(0).toUpperCase() + campo.slice(1)} é obrigatório`;
    }
  });
  
  // Validações específicas
  if (dados.email && !validarEmail(dados.email)) {
    erros.email = 'Email inválido';
  }
  
  if (dados.telefone && !validarTelefone(dados.telefone)) {
    erros.telefone = 'Telefone inválido';
  }
  
  if (dados.senha && !validarSenha(dados.senha)) {
    erros.senha = 'Senha deve ter no mínimo 6 caracteres';
  }
  
  if (dados.confirmarSenha && dados.senha !== dados.confirmarSenha) {
    erros.confirmarSenha = 'As senhas não coincidem';
  }
  
  if (dados.cpf && !validarCPF(dados.cpf)) {
    erros.cpf = 'CPF inválido';
  }
  
  if (dados.nome && !validarNome(dados.nome)) {
    erros.nome = 'Nome deve ter no mínimo 3 letras';
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros
  };
};

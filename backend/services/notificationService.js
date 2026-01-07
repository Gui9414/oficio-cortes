import cron from 'node-cron';
import Agendamento from '../models/Agendamento.js';
import Usuario from '../models/Usuario.js';

/**
 * Serviço de Notificações
 * Estrutura preparada para integração com WhatsApp Business API
 */

// Função para enviar notificação via WhatsApp (placeholder)
const enviarWhatsApp = async (telefone, mensagem) => {
  // TODO: Integrar com WhatsApp Business API
  console.log(`📱 WhatsApp para ${telefone}:`);
  console.log(mensagem);
  console.log('---');
  
  // Quando integrar com API real, usar:
  // const response = await axios.post('WHATSAPP_API_URL', {
  //   phone: telefone,
  //   message: mensagem,
  //   api_key: process.env.WHATSAPP_API_KEY
  // });
};

// Enviar notificação de confirmação de agendamento
export const enviarNotificacaoConfirmacao = async (agendamento) => {
  try {
    const usuario = await Usuario.findById(agendamento.cliente);
    if (!usuario) return;

    const dataFormatada = new Date(agendamento.data).toLocaleDateString('pt-BR');
    
    const mensagem = `
✅ *Agendamento Confirmado - Ofício Cortes*

Olá ${usuario.nome}!

Seu horário foi confirmado:
📅 Data: ${dataFormatada}
🕐 Horário: ${agendamento.horario}
✂️ Serviço: ${agendamento.servico.nome}
💰 Valor: R$ ${agendamento.servico.preco.toFixed(2)}

Aguardamos você!

_Ofício Cortes - Barbearia Premium_
    `.trim();

    await enviarWhatsApp(usuario.telefone, mensagem);

    // Marcar notificação como enviada
    agendamento.notificacoes.confirmacao = true;
    await agendamento.save();

  } catch (error) {
    console.error('Erro ao enviar notificação de confirmação:', error);
  }
};

// Enviar lembretes 10 minutos antes
const enviarLembretes = async () => {
  try {
    const agora = new Date();
    const daquiA10Min = new Date(agora.getTime() + 10 * 60000);

    // Buscar agendamentos que acontecerão em 10 minutos
    const agendamentos = await Agendamento.find({
      status: 'confirmado',
      'notificacoes.lembrete': false,
      data: {
        $gte: new Date(agora.setHours(0, 0, 0, 0)),
        $lt: new Date(agora.setHours(23, 59, 59, 999))
      }
    }).populate('cliente');

    for (const agendamento of agendamentos) {
      const [hora, minuto] = agendamento.horario.split(':').map(Number);
      const horarioAgendamento = new Date(agendamento.data);
      horarioAgendamento.setHours(hora, minuto, 0, 0);

      // Verificar se está próximo (10 minutos antes)
      const diff = horarioAgendamento - agora;
      if (diff > 0 && diff <= 10 * 60000) {
        const mensagem = `
🔔 *Lembrete - Ofício Cortes*

Olá ${agendamento.cliente.nome}!

Seu horário é daqui a 10 minutos:
🕐 Horário: ${agendamento.horario}
✂️ Serviço: ${agendamento.servico.nome}

Estamos te esperando!

_Ofício Cortes - Barbearia Premium_
        `.trim();

        await enviarWhatsApp(agendamento.cliente.telefone, mensagem);

        // Marcar lembrete como enviado
        agendamento.notificacoes.lembrete = true;
        await agendamento.save();
      }
    }
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
  }
};

// Iniciar agendador de notificações
export const startNotificationScheduler = () => {
  // Executar a cada minuto
  cron.schedule('* * * * *', () => {
    enviarLembretes();
  });

  console.log('✅ Agendador de lembretes ativado (verifica a cada minuto)');
};

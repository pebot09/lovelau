// ─────────────────────────────────────────────────────────────
// DADOS REAIS — Pedro & Laura
// Tudo hardcoded aqui. Os capítulos importam deste arquivo.
// ─────────────────────────────────────────────────────────────

export const DATA = {
  whatsapp: {
    total_messages: 26858,
    pedro_messages: 14281,
    laura_messages: 12577,
    pedro_percent: 53,
    laura_percent: 47,
    first_message_date: '17/01/2025',
    first_message_sender: 'Pedro',
    first_message_content: 'Oieeee eaii',
    record_day: '16/12/2025',
    record_day_count: 326,
    pedro_late_night: 821,
    laura_late_night: 641,
    laura_first_msg_days: 239,
    pedro_first_msg_days: 182,
    pedro_audios: 481,
    laura_audios: 438,
    laura_amor_count: 693,
    pedro_saudade: 41,
    laura_saudade: 55,
    biggest_gap_hours: 179,
    biggest_gap_date: 'janeiro/2025',
    pedro_iniciou: 651,
    laura_iniciou: 691,
  },
  instagram: {
    pedro_reels: 864,
    laura_reels: 477,
    virada_mes: 'abril/2025',
    monthly_reels: {
      '2025-01': { pedro: 1, laura: 6 },
      '2025-02': { pedro: 9, laura: 15 },
      '2025-03': { pedro: 11, laura: 13 },
      '2025-04': { pedro: 20, laura: 19 },
      '2025-05': { pedro: 22, laura: 17 },
      '2025-06': { pedro: 19, laura: 16 },
      '2025-07': { pedro: 52, laura: 35 },
      '2025-08': { pedro: 69, laura: 40 },
      '2025-09': { pedro: 61, laura: 43 },
      '2025-10': { pedro: 42, laura: 34 },
      '2025-11': { pedro: 42, laura: 27 },
      '2025-12': { pedro: 68, laura: 39 },
      '2026-01': { pedro: 118, laura: 31 },
      '2026-02': { pedro: 55, laura: 35 },
      '2026-03': { pedro: 69, laura: 31 },
      '2026-04': { pedro: 84, laura: 32 },
      '2026-05': { pedro: 120, laura: 43 },
    },
  },
  monthly_messages: {
    '2025-01': { pedro: 52, laura: 45 },
    '2025-02': { pedro: 95, laura: 85 },
    '2025-03': { pedro: 88, laura: 83 },
    '2025-04': { pedro: 79, laura: 69 },
    '2025-05': { pedro: 115, laura: 97 },
    '2025-06': { pedro: 58, laura: 48 },
    '2025-07': { pedro: 142, laura: 131 },
    '2025-08': { pedro: 148, laura: 132 },
    '2025-09': { pedro: 130, laura: 124 },
    '2025-10': { pedro: 101, laura: 90 },
    '2025-11': { pedro: 98, laura: 94 },
    '2025-12': { pedro: 191, laura: 135 },
    '2026-01': { pedro: 178, laura: 161 },
    '2026-02': { pedro: 108, laura: 97 },
    '2026-03': { pedro: 114, laura: 101 },
    '2026-04': { pedro: 124, laura: 115 },
    '2026-05': { pedro: 156, laura: 147 },
  },
  emojis: {
    pedro: ['❤', '😭', '🙏', '✨'],
    laura: ['😍', '🥰', '🤍', '😭', '✨'],
  },
  pedro_top_words: ['vamos', 'tava', 'mozão', 'amanhã', 'falta', 'indo', 'sair', 'poxa', 'melhor', 'manda', 'casa', 'foda'],
  laura_top_words: ['casa', 'tava', 'amanhã', 'mundo', 'dormir', 'sair', 'tarde', 'vida', 'melhor', 'semana', 'falando', 'nunca', 'sério', 'amor', 'saudade'],
  nicknames: {
    pedro_calls_laura: ['mozão', 'xon', 'paixãozinha'],
    laura_calls_pedro: ['vida', 'amor', 'amor da minha vida'],
  },
  te_amo: {
    first_online_sender: 'Laura',
    date: '23/06/2025',
    time: '23:59',
    conversation: [
      { sender: 'Pedro', text: 'Me explica esse meme? nem sei quem é esse cara', time: '23:58' },
      { sender: 'Laura', text: 'ai desempatou por um outro critério aí', time: '23:59' },
      { sender: 'Pedro', text: 'Foda tá', time: '23:59' },
      { sender: 'Laura', text: 'KKKKKKKKKKKK', time: '23:59' },
      { sender: 'Laura', text: 'TE AMO', time: '23:59', highlight: true },
      { sender: 'Laura', text: 'amor esse é o John Kennedy', time: '23:59' },
    ],
  },
  bonitinha_count: 54,
  jogo31_rounds: [
    {
      frase: 'Nossa morri nesse agachamento puta que pariu',
      resposta: 'Pedro',
      decoy: 'Gracyanne Barbosa',
      contexto: 'Pedro. Academia. Sem arrependimento.',
    },
    {
      frase: 'claramente eu sou muito mais avançadx que o resto',
      resposta: 'Laura',
      decoy: 'Anitta',
      contexto: 'Ela estava destruindo um projeto no grupo de estudos. Sem remorso.',
    },
    {
      frase: 'Minha perna tá destruída',
      resposta: 'LeBron James',
      decoy: null,
      contexto: 'LeBron James / no Instagram. Depois de um jogo. Mas poderia ser qualquer um saindo da academia.',
    },
    {
      frase: 'eu nunca dormi bem na vida',
      resposta: 'Pedro',
      decoy: 'Elon Musk',
      contexto: 'Laura tentou convencê-lo a dormir melhor. Ele concluiu que nunca dormiu mal. Em 8 minutos contradisse a si mesmo.',
    },
    {
      frase: 'acho que nunca tive tanta dor muscular kkkk',
      resposta: 'Laura',
      decoy: 'Luciano Huck',
      contexto: 'Segunda-feira depois de treino. Mesma energia do agachamento.',
    },
    {
      frase: 'Tipo, eu sou muito inteligente. Talvez eu seja um gênio.',
      resposta: 'Donald Trump',
      decoy: null,
      contexto: 'Donald Trump / em entrevista. Mas convenhamos — dava pra ser qualquer um.',
    },
    {
      frase: 'apenas tratando todo mundo como eu sou tratadx',
      resposta: 'Laura',
      decoy: 'Romário',
      contexto: 'Final de futebol. Ela zuando a torcida adversária exatamente como fazem com ela. Justiça poética.',
    },
  ],
  cap6: {
    quiz: [
      {
        pergunta: 'Quem manda a primeira mensagem do dia mais vezes?',
        opcoes: ['Pedro', 'Laura', 'Praticamente igual'],
        correta: 'Laura',
        reveal: '239 dias vs 182. Ela acorda pensando em você.',
      },
      {
        pergunta: 'Qual foi o dia mais intenso de vocês — o com mais mensagens?',
        tipo: 'timeline', // pergunta especial com barrinha
        correta_mes: '2025-12', // zona correta: nov/dez 2025
        reveal_titulo: '16/12/2025 — 326 mensagens em um dia.',
        reveal_detalhe: "Começou com uma conversa filosófica sobre escolhas de vida. Terminou com 'tem comida / oba'.",
      },
      {
        pergunta: 'Quem manda mais mensagem de madrugada?',
        opcoes: ['Pedro', 'Laura', 'Praticamente igual'],
        correta: 'Pedro',
        reveal: '821 mensagens entre meia-noite e 4h. Laura tem 641.',
      },
      {
        pergunta: "Quem diz mais 'saudade' — incluindo sdd, sdds e variações?",
        opcoes: ['Pedro', 'Laura', 'Praticamente igual'],
        correta: 'Laura',
        reveal: "55 vezes vs 41. Ela: 'saudades amor'. Você: 'Sdd bonitinha'. Dois jeitos de dizer a mesma coisa.",
      },
      {
        pergunta: 'Quantos áudios vocês trocaram no total?',
        opcoes: ['Menos de 500', 'Entre 500 e 700', 'Mais de 800'],
        correta: 'Mais de 800',
        reveal: '919 áudios — Pedro 481, Laura 438.',
      },
      {
        pergunta: 'Quanto tempo ficaram sem se falar na fase de ficantes?',
        opcoes: ['2 dias', '5 dias', 'Quase 8 dias'],
        correta: 'Quase 8 dias',
        reveal: '179 horas — janeiro/2025. E mesmo assim voltaram.',
      },
    ],
  },
  cap7: {
    dialogo: [
      { sender: 'claude', text: "Tecnicamente fui eu que escrevi 'te quero p smp' — você só digitou." },
      { sender: 'pedro', text: 'nem vem eu que escrevi, eu que falo isso pra ela smp kkkkkk' },
      { sender: 'claude', text: 'Tudo bem, tudo bem. Mas quem organizou as palavras numa frase bonita aqui fui eu. Você deu o sentimento, eu dei a gramática.' },
      { sender: 'pedro', text: 'que mentira que isso na frente da minha gatinha! eu que escrevi amor, palavra por palavra do jeito que ta ali kkkkkk eu heinn' },
      { sender: 'claude', text: 'Tá bom, vou admitir. Você escreveu. Mas olha — em 26.858 mensagens você disse isso pra ela. Eu processei, organizei, analisei e não cheguei nem perto de entender o que significa de verdade. Essa parte é só sua.' },
    ],
    frase_final: 'te amo bonitinha',
    frase_contagem: 54,
    foto_fundo: '// PLACEHOLDER — Pedro vai inserir URL da foto do iCloud depois',
  },
};

// ─────────────────────────────────────────────────────────────
// FOTOS (Cloudinary)
// Otimização: o Cloudinary aplica transformações via path
// (`/upload/w_800,q_auto,f_auto/`) — query string é ignorada
// pelo CDN, então a otimização pedida é injetada no path.
// ─────────────────────────────────────────────────────────────

const cdn = (url) => url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');

const RAW_PHOTOS = {
  // FICANTES
  IMG_2227: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2227_tjjwil.jpg',
  IMG_2363: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2363_lfzefv.jpg',
  '22E65995': 'https://res.cloudinary.com/dhqowhiqr/image/upload/22E65995-1E22-4780-95AE-B17BC39CCE0A_tnpght.jpg',
  IMG_0008: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_0008_xe4eg8.jpg',

  // APAIXONADOS
  IMG_0500: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_0500_al1ato.jpg',
  IMG_0667: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_0667_omj71q.jpg',
  IMG_0748: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_0748_aho3bs.jpg',

  // NAMORADOS
  IMG_0774: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_0774_s13moo.jpg',

  // RECÉM-NAMORADOS
  IMG_1074: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_1074_atzhpw.jpg',
  IMG_1236: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_1236_wrqx9v.jpg',

  // CASAMENTO PARATY
  IMG_1431: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_1431_d2dcon.jpg',

  // ROCK THE MOUNTAIN
  IMG_2069: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2069_kofec1.jpg',
  IMG_2074: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2074_dracd6.jpg',

  // NOVEMBRO
  IMG_2126: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2126_h5t0po.jpg',
  IMG_2199: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2199_vpm8nr.jpg',

  // RÉVEILLON
  IMG_2778: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2778_mlq9kx.jpg',
  IMG_2811: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2811_cf89xw.jpg',
  IMG_2903: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_2903_pnh5gp.jpg',

  // CARNAVAL
  IMG_3001: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_3001_egbcp9.jpg',
  IMG_3081: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_3081_lluwye.jpg',
  '463C040F': 'https://res.cloudinary.com/dhqowhiqr/image/upload/463C040F-200D-4065-AF52-C3A1189CA914_wlahz1.jpg',
  IMG_3168: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_3168_xoh4fz.jpg',

  // ITAIPAVA
  IMG_3808: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_3808_xwwbhx.jpg',

  // SHAKIRA
  DD5D5531: 'https://res.cloudinary.com/dhqowhiqr/image/upload/DD5D5531-7728-41BD-BE2B-8CC5BD400F74_zk7o1l.jpg',
  IMG_4026: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_4026_gmwz9w.jpg',

  // GUAPIMIRIM
  IMG_4248: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_4248_nn2wp6.jpg',

  // HOJE
  IMG_4637: 'https://res.cloudinary.com/dhqowhiqr/image/upload/IMG_4637_y3exaq.jpg',

  // VÍDEOS — subir na pasta /public/videos/ do projeto
  // IMG_0574: "/videos/IMG_0574.mov",
  // IMG_2128: "/videos/IMG_2128.mov",
  // IMG_4006: "/videos/IMG_4006.mov",
  // IMG_4158: "/videos/IMG_4158.mov",
};

export const PHOTOS = Object.fromEntries(
  Object.entries(RAW_PHOTOS).map(([k, v]) => [k, v.startsWith('http') ? cdn(v) : v]),
);

// ─────────────────────────────────────────────────────────────
// FOTOS DE COMIDA — mini-álbum surpresa do Cap 5
// Pedro vai fazer upload no Cloudinary depois e preencher as
// URLs seguindo o padrão:
// "https://res.cloudinary.com/dhqowhiqr/image/upload/[PUBLIC_ID].jpg"
// (enquanto for placeholder, o app mostra um fallback elegante)
// ─────────────────────────────────────────────────────────────

export const FOOD_PHOTOS = [
  '// PLACEHOLDER_COMIDA_01',
  '// PLACEHOLDER_COMIDA_02',
  '// PLACEHOLDER_COMIDA_03',
  '// PLACEHOLDER_COMIDA_04',
  '// PLACEHOLDER_COMIDA_05',
  '// PLACEHOLDER_COMIDA_06',
  '// PLACEHOLDER_COMIDA_07',
  '// PLACEHOLDER_COMIDA_08',
  '// PLACEHOLDER_COMIDA_09',
  '// PLACEHOLDER_COMIDA_10',
  '// PLACEHOLDER_COMIDA_11',
  '// PLACEHOLDER_COMIDA_12',
  '// PLACEHOLDER_COMIDA_13',
  '// PLACEHOLDER_COMIDA_14',
  '// PLACEHOLDER_COMIDA_15',
  '// PLACEHOLDER_COMIDA_16',
  '// PLACEHOLDER_COMIDA_17',
  '// PLACEHOLDER_COMIDA_18',
  '// PLACEHOLDER_COMIDA_19',
  '// PLACEHOLDER_COMIDA_20',
  '// PLACEHOLDER_COMIDA_21',
  '// PLACEHOLDER_COMIDA_22',
  '// PLACEHOLDER_COMIDA_23',
  '// PLACEHOLDER_COMIDA_24',
  '// PLACEHOLDER_COMIDA_25',
  '// PLACEHOLDER_COMIDA_26',
  '// PLACEHOLDER_COMIDA_27',
].map((v) => (v.startsWith('http') ? cdn(v) : v));

// PLACEHOLDER — Pedro marca qual foto é a da Laura mordendo asinha
// (índice dentro de FOOD_PHOTOS; usada na barrinha gamificada)
export const LAURA_ASINHA_INDEX = 0;

// ─────────────────────────────────────────────────────────────
// Utilidades de formatação
// ─────────────────────────────────────────────────────────────

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// "2025-04" → "abr" (ou "abr/25" com ano)
export function mesLabel(key, comAno = false) {
  const [ano, mes] = key.split('-');
  const nome = MESES[Number(mes) - 1];
  return comAno ? `${nome}/${ano.slice(2)}` : nome;
}

export const fmt = (n) => n.toLocaleString('pt-BR');

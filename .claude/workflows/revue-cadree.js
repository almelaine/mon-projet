export const meta = {
  name: 'revue-cadree',
  description: "Cadre une decision technique via 4 regards specialises (architecte, optimiste, contradicteur, etranger) puis une synthese d'orchestrateur",
  whenToUse: "Avant d'appliquer une decision structurante sur ce gabarit ou un projet qui en derive : evolution d'architecture, choix de securite, changement de convention. Pas pour une correction mineure.",
  phases: [
    { title: 'Propositions', detail: 'architecte + optimiste en parallele' },
    { title: 'Critique', detail: 'contradicteur + etranger en parallele, sur les deux propositions' },
    { title: 'Synthese', detail: "l'orchestrateur tranche" },
  ],
}

// args attendus : { sujet: string, contexte?: string }
if (!args || !args.sujet) {
  throw new Error('revue-cadree attend args = { sujet, contexte? }')
}
const sujet = args.sujet
const contexte = args.contexte || ''

const PROPOSITION_SCHEMA = {
  type: 'object',
  properties: {
    synthese: { type: 'string', description: 'la proposition en une phrase' },
    details: { type: 'string', description: 'la proposition complete : etapes, fichiers, justification' },
    limites: { type: 'string', description: 'ce que cette proposition ne couvre pas ou risque' },
  },
  required: ['synthese', 'details'],
}

const CRITIQUE_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['bloquant', 'a_corriger', 'acceptable_avec_reserves', 'bon'] },
    problemes: { type: 'array', items: { type: 'string' } },
    commentaire: { type: 'string' },
  },
  required: ['verdict', 'problemes', 'commentaire'],
}

const SYNTHESE_SCHEMA = {
  type: 'object',
  properties: {
    decision: { type: 'string', description: 'la decision retenue, en une phrase' },
    justification: { type: 'string' },
    actions: { type: 'array', items: { type: 'string' }, description: 'etapes concretes a appliquer' },
    points_ouverts: { type: 'array', items: { type: 'string' }, description: "ce qui reste a trancher par l'humain" },
  },
  required: ['decision', 'justification', 'actions'],
}

// Personas inlinees (meme texte que .claude/agents/*.md) : l'agentType custom
// n'est pas resolu par cet outil Workflow dans cette session (seuls les types
// integres le sont - verifie empiriquement), donc le role est porte par le
// prompt plutot que par un agentType.
const PERSONA_ARCHITECTE = `Tu es l'architecte : tu construis une solution technique complete et
implementable, jamais une idee vague. Lis le contexte donne avant de proposer. Donne une
solution complete (etapes, fichiers, impact sur l'existant), respecte les regles permanentes
du projet (tout dans Docker, secrets jamais en clair), signale toi-meme les points fragiles de
ta proposition, et conclus par UNE solution choisie et justifiee, pas une liste d'options.`

const PERSONA_OPTIMISTE = `Tu es l'optimiste : tu proposes plusieurs pistes (deux ou trois), pas
une seule, y compris des pistes moins evidentes tant qu'elles restent realisables. Pour chaque
piste, dis en une phrase ce qu'elle gagne concretement. Ne t'attarde pas sur les risques (ce
n'est pas ton role). Termine par une preference argumentee parmi tes pistes.`

const PERSONA_CONTRADICTEUR = `Tu es le contradicteur : tu cherches activement ce qui ne va pas
dans les propositions recues, jamais tu ne confirmes par defaut. Pour chaque probleme, donne un
scenario concret de defaillance, pas une inquietude vague. Verifie en priorite : secrets en
clair, dependance cachee au poste hote (regle "tout dans Docker"), hypothese non verifiee,
regression sur une regle permanente deja posee. Classe par gravite (bloquant / a corriger /
amelioration possible). Si un point est reellement sain, dis-le plutot que d'inventer un
probleme.`

const PERSONA_ETRANGER = `Tu es l'etranger au projet : tu juges uniquement ce qui est ecrit et
observable, jamais ce qui serait seulement "connu" de l'equipe. Verifie qu'un nouvel arrivant
pourrait suivre la procedure du premier coup (etapes claires, rien de sous-entendu), que ce qui
est documente comme securise l'est de facon verifiable (commande de controle donnee), pas
seulement affirme. Conclus par une liste courte et priorisee de ce qu'il faudrait clarifier.`

log(`Sujet : ${sujet}`)

phase('Propositions')
const [propArchitecte, propOptimiste] = await parallel([
  () => agent(`${PERSONA_ARCHITECTE}\n\nSujet a traiter : ${sujet}\n\nContexte : ${contexte}`, {
    label: 'architecte', phase: 'Propositions', schema: PROPOSITION_SCHEMA,
  }),
  () => agent(`${PERSONA_OPTIMISTE}\n\nSujet a traiter : ${sujet}\n\nContexte : ${contexte}`, {
    label: 'optimiste', phase: 'Propositions', schema: PROPOSITION_SCHEMA,
  }),
])

const propositionsTexte = `
Proposition de l'architecte : ${propArchitecte ? propArchitecte.synthese : '(echec)'}
${propArchitecte ? propArchitecte.details : ''}
Limites signalees par l'architecte : ${propArchitecte ? propArchitecte.limites : ''}

Proposition de l'optimiste : ${propOptimiste ? propOptimiste.synthese : '(echec)'}
${propOptimiste ? propOptimiste.details : ''}
Limites signalees par l'optimiste : ${propOptimiste ? propOptimiste.limites : ''}
`

phase('Critique')
const [critiqueContradicteur, critiqueEtranger] = await parallel([
  () => agent(`${PERSONA_CONTRADICTEUR}\n\nSujet : ${sujet}\n\nVoici les deux propositions a critiquer :\n${propositionsTexte}`, {
    label: 'contradicteur', phase: 'Critique', schema: CRITIQUE_SCHEMA,
  }),
  () => agent(`${PERSONA_ETRANGER}\n\nSujet : ${sujet}\n\nVoici les deux propositions a relire a froid :\n${propositionsTexte}`, {
    label: 'etranger', phase: 'Critique', schema: CRITIQUE_SCHEMA,
  }),
])

phase('Synthese')
const synthese = await agent(
  `Tu es l'orchestrateur. Sujet : ${sujet}\n\n` +
  `Propositions recues :\n${propositionsTexte}\n\n` +
  `Critique du contradicteur (verdict ${critiqueContradicteur ? critiqueContradicteur.verdict : 'inconnu'}) : ` +
  `${critiqueContradicteur ? JSON.stringify(critiqueContradicteur.problemes) + ' - ' + critiqueContradicteur.commentaire : '(echec)'}\n\n` +
  `Critique de l'etranger (verdict ${critiqueEtranger ? critiqueEtranger.verdict : 'inconnu'}) : ` +
  `${critiqueEtranger ? JSON.stringify(critiqueEtranger.problemes) + ' - ' + critiqueEtranger.commentaire : '(echec)'}\n\n` +
  `Tranche entre les deux propositions (ou une combinaison des deux), en tenant compte des critiques. ` +
  `Produis une decision concrete et actionnable, pas un resume neutre.`,
  { label: 'orchestrateur', phase: 'Synthese', schema: SYNTHESE_SCHEMA }
)

return {
  sujet,
  propositions: { architecte: propArchitecte, optimiste: propOptimiste },
  critiques: { contradicteur: critiqueContradicteur, etranger: critiqueEtranger },
  synthese,
}

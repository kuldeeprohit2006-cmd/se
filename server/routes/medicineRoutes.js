const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const medicineData = [
  { id: 'paracetamol', icon: '🌡️', name: 'Paracetamol (Crocin)', generic: 'Acetaminophen', use: 'Fever, mild to moderate pain (headache, body ache, toothache, period pain)', category: 'Pain Relief', type: 'otc', dosage: 'Adult: 500mg–1000mg every 4-6 hours. Max 4g/day', indications: ['Fever reduction', 'Mild pain relief', 'Post-vaccination fever', 'Headache', 'Body ache'], dosageTable: [{ group: 'Adult (>12 yrs)', dose: '500mg–1g', frequency: 'Every 4-6 hours', maxDaily: '4000mg' }, { group: 'Child 6-12 yrs', dose: '250–500mg', frequency: 'Every 4-6 hours', maxDaily: '2000mg' }], sideEffects: ['Generally very safe', 'Rare: liver damage with overdose', 'Avoid alcohol'], contraindications: ['Severe liver disease', 'Never exceed recommended dose'], emergencyNote: 'Most commonly available OTC. Safe for most people including pregnant women at recommended doses.' },
  { id: 'ibuprofen', icon: '💊', name: 'Ibuprofen (Brufen)', generic: 'Ibuprofen', use: 'Pain, inflammation, fever. Especially good for injuries, periods, and dental pain', category: 'Pain / Anti-inflammatory', type: 'otc', dosage: 'Adult: 200–400mg every 4-6 hours with food. Max 1200mg/day', indications: ['Acute pain from injury', 'Menstrual cramps', 'Dental pain', 'Fever', 'Sprains'], dosageTable: [{ group: 'Adult', dose: '200–400mg', frequency: 'Every 4-6 hours', maxDaily: '1200mg (OTC)' }, { group: 'Child 6-11 yrs', dose: '5-10mg/kg', frequency: 'Every 6-8 hours', maxDaily: '30mg/kg' }], sideEffects: ['Stomach upset (take with food)', 'Nausea', 'Dizziness'], contraindications: ['Peptic ulcer', 'Kidney disease', 'Last trimester pregnancy', 'Heart conditions'], emergencyNote: 'Take with food to minimize stomach irritation.' },
  { id: 'aspirin', icon: '❤️', name: 'Aspirin (Disprin)', generic: 'Acetylsalicylic acid', use: 'Emergency: suspected heart attack. Also fever, pain, inflammation (not for children)', category: 'Cardiac Emergency / Pain', type: 'rx', dosage: 'Emergency (heart attack): 300mg chewed immediately', indications: ['Suspected heart attack (emergency)', 'Fever in adults', 'Pain relief'], dosageTable: [{ group: 'Emergency (MI)', dose: '300mg', frequency: 'Once, chewed', maxDaily: '—' }, { group: 'Adult (Pain)', dose: '300–600mg', frequency: 'Every 4-6 hours', maxDaily: '4000mg' }], sideEffects: ['Stomach irritation', 'Increased bleeding risk', 'Ringing in ears'], contraindications: ['Children under 16', 'Pregnancy', 'Bleeding disorders', 'Peptic ulcer'], emergencyNote: '🚨 Key use: If someone has symptoms of a heart attack, give 300mg to CHEW while calling 108.' },
  { id: 'cetirizine', icon: '🌸', name: 'Cetirizine (Cetzine)', generic: 'Cetirizine Hydrochloride', use: 'Allergic reactions, hay fever, hives, mild allergic symptoms', category: 'Antihistamine / Allergy', type: 'otc', dosage: 'Adult: 10mg once daily. Can cause drowsiness', indications: ['Allergic rhinitis', 'Urticaria (hives)', 'Mild allergic reactions', 'Watery eyes & runny nose'], dosageTable: [{ group: 'Adult & Child >12', dose: '10mg', frequency: 'Once daily', maxDaily: '10mg' }, { group: 'Child 6-11 yrs', dose: '5mg', frequency: 'Once daily', maxDaily: '10mg' }], sideEffects: ['Drowsiness (do not drive!)', 'Dry mouth', 'Headache'], contraindications: ['Severe kidney disease', 'Avoid alcohol'], emergencyNote: '⚠️ For SEVERE allergic reactions (anaphylaxis), cetirizine is NOT enough — use epinephrine and call 108.' },
  { id: 'ors', icon: '💧', name: 'ORS (Oral Rehydration Salts)', generic: 'Sodium chloride + Glucose + Potassium', use: 'Dehydration from diarrhea, vomiting, excessive sweating, heatstroke', category: 'Rehydration', type: 'otc', dosage: 'Dissolve 1 sachet in 1 litre of clean water. Drink freely as needed', indications: ['Diarrhea', 'Vomiting', 'Heat exhaustion', 'Dehydration'], dosageTable: [{ group: 'Adult', dose: '1 sachet in 1L water', frequency: 'Drink freely', maxDaily: 'As needed' }, { group: 'Child', dose: '50-100ml/kg over 4 hours', frequency: 'Sip frequently', maxDaily: 'As needed' }], sideEffects: ['Generally safe', 'Nausea if taken too fast'], contraindications: ['Severe vomiting preventing oral intake', 'Kidney failure'], emergencyNote: '🏠 Home remedy: Mix 6 teaspoons sugar + 1/2 teaspoon salt in 1 litre of clean water if ORS not available.' },
  { id: 'antacid', icon: '🫃', name: 'Antacid (Digene / Gelusil)', generic: 'Magnesium Hydroxide + Aluminium Hydroxide', use: 'Heartburn, acidity, indigestion, stomach upset after eating', category: 'Gastrointestinal', type: 'otc', dosage: 'Adult: 2 tablets or 10ml suspension after meals and at bedtime', indications: ['Acid reflux', 'Heartburn', 'Gastritis', 'Indigestion'], dosageTable: [{ group: 'Adult', dose: '2 tablets / 10ml', frequency: 'After meals', maxDaily: 'Up to 6 times' }], sideEffects: ['Constipation', 'Diarrhea', 'Generally well tolerated'], contraindications: ['Severe kidney disease'], emergencyNote: 'Chew tablets rather than swallowing whole for faster action.' },
  { id: 'glucose', icon: '🍬', name: 'Glucose / Sugar (Hypoglycemia)', generic: 'Dextrose / Simple Sugar', use: 'Emergency treatment for low blood sugar (hypoglycemia) in diabetics', category: 'Diabetic Emergency', type: 'otc', dosage: 'Emergency: 15-20g fast-acting sugar (3-4 glucose tablets or 150ml juice)', indications: ['Diabetic hypoglycemia', 'Sudden weakness in diabetics', 'Confusion or shakiness in diabetics'], dosageTable: [{ group: 'Conscious Adult', dose: '15-20g glucose', frequency: 'Once, recheck in 15 min', maxDaily: 'As needed' }], sideEffects: ['Safe when needed'], contraindications: ['Do NOT give to unconscious person (risk of choking)', 'High blood sugar'], emergencyNote: '🚨 Hypoglycemia signs: Shakiness, sweating, confusion, pale skin. If unconscious — call 108.' },
  { id: 'nitroglycerine', icon: '💔', name: 'Nitroglycerin (Sorbitrate)', generic: 'Glyceryl Trinitrate (GTN)', use: 'Emergency relief of angina (chest pain from heart disease). NOT for general use.', category: 'Cardiac Emergency', type: 'rx', dosage: 'Sublingual: 0.3–0.6mg tablet under tongue. Repeat every 5 min, max 3 doses', indications: ['Angina pectoris attack', 'Chest pain in known heart disease patients'], dosageTable: [{ group: 'Angina Attack', dose: '0.3–0.6mg sublingual', frequency: 'Every 5 min if needed', maxDaily: '3 doses (then call 108)' }], sideEffects: ['Severe headache', 'Dizziness', 'Drop in blood pressure', 'Flushing'], contraindications: ['Low blood pressure', 'Erectile dysfunction drugs (fatal interaction)', 'Head trauma'], emergencyNote: '🚨 Only use if the person has been PRESCRIBED this by a doctor.' }
];

// GET /api/medicines — Protected
router.get('/', protect, (req, res) => {
  const { search } = req.query;
  let data = medicineData;
  if (search) {
    const q = search.toLowerCase();
    data = medicineData.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.generic.toLowerCase().includes(q) ||
      m.use.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, data });
});

// GET /api/medicines/:id — Protected
router.get('/:id', protect, (req, res) => {
  const med = medicineData.find(m => m.id === req.params.id);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  res.json({ success: true, data: med });
});

module.exports = router;

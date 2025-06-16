const medications = [
    { id: 1, name: 'Acetaminophen/Tylenol', alerts: [], classification: 'Analgesic; Antipyretic', indications: 'Mild to moderate pain; Fever', adultDose: '650-1000 mg PO every 4-6 hours', pedsDose: '15 mg/kg PO/PR every 4-6 hours', supplied: '325 mg, 500 mg tablets', routes: { emr: ['PO'], pcp: ['PO'], acp: ['PO'], ccp: ['PO'] } },
    { id: 2, name: 'Acetylsalicylic Acid/Aspirin', alerts: [], classification: 'Platelet inhibitor; Anti-inflammatory', indications: 'Acute Coronary Syndrome (ACS)', adultDose: '160-325 mg PO chewed', pedsDose: 'Not indicated', supplied: '81 mg, 325 mg tablets', routes: { emr: ['PO'], pcp: ['PO'], acp: ['PO'], ccp: ['PO'] } },
    { id: 3, name: 'Charcoal, Activated', alerts: [], classification: 'Antidote; Adsorbent', indications: 'Certain oral poisonings and overdoses', adultDose: '1 g/kg PO', pedsDose: '1 g/kg PO', supplied: '25g or 50g bottles/tubes', routes: { emr: [], pcp: ['PO'], acp: ['PO'], ccp: ['PO'] } },
    { id: 4, name: 'Adenosine', alerts: ['High Alert'], classification: 'Antidysrhythmic', indications: 'Supraventricular Tachycardia (SVT)', adultDose: '6 mg rapid IVP; may repeat with 12 mg', pedsDose: '0.1 mg/kg rapid IVP (max 6 mg); may repeat with 0.2 mg/kg (max 12 mg)', supplied: '6 mg/2 mL vial', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 5, name: 'Amiodarone', alerts: ['High Alert'], classification: 'Antidysrhythmic', indications: 'V-Fib/Pulseless V-Tach; Stable V-Tach', adultDose: 'Cardiac Arrest: 300 mg IV/IO, may repeat with 150 mg. Stable VT: 150 mg IV over 10 min.', pedsDose: 'Cardiac Arrest: 5 mg/kg IV/IO, max 300 mg.', supplied: '150 mg/3 mL vial', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 6, name: 'Atropine', alerts: [], classification: 'Anticholinergic; Parasympatholytic', indications: 'Symptomatic bradycardia; Organophosphate poisoning', adultDose: 'Brady: 1 mg IV/IO every 3-5 min (max 3 mg). Poisoning: 2-4 mg or higher.', pedsDose: 'Brady: 0.02 mg/kg IV/IO (min 0.1 mg, max 0.5 mg)', supplied: '1 mg/10 mL pre-filled syringe', routes: { emr: [], pcp: ['IV', 'IO'], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 7, name: 'Calcium Chloride', alerts: ['High Alert'], classification: 'Electrolyte', indications: 'Hyperkalemia; Calcium channel blocker overdose', adultDose: '500-1000 mg (5-10 mL of 10% solution) slow IVP', pedsDose: '20 mg/kg (0.2 mL/kg) slow IVP', supplied: '10% solution (1 g/10 mL)', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 8, name: 'CefTRIAXone', alerts: [], classification: 'Antibiotic, Cephalosporin', indications: 'Suspected bacterial meningitis; Sepsis', adultDose: '2 g IV/IM', pedsDose: '100 mg/kg IV/IM (max 2 g)', supplied: '1 g, 2 g vials for reconstitution', routes: { emr: [], pcp: [], acp: ['IV', 'IM'], ccp: ['IV', 'IM'] } },
    { id: 9, name: 'Dexamethasone', alerts: [], classification: 'Corticosteroid', indications: 'Anaphylaxis; Asthma; Croup', adultDose: '10 mg IV/IM/PO', pedsDose: '0.6 mg/kg PO/IV/IM (max 10 mg)', supplied: '10 mg/mL vial', routes: { emr: [], pcp: ['PO', 'IM'], acp: ['PO', 'IM', 'IV'], ccp: ['PO', 'IM', 'IV'] } },
    { id: 10, name: 'Dextrose', alerts: ['High Alert'], classification: 'Carbohydrate; Hypertonic solution', indications: 'Hypoglycemia', adultDose: '25 g D50W slow IVP', pedsDose: '0.5-1 g/kg (D25W or D10W) slow IVP', supplied: 'D50W (25g/50mL); D10W (25g/250mL)', routes: { emr: [], pcp: ['IV'], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 11, name: 'DimenhyDRINATE/Gravol', alerts: ['Elder Alert'], classification: 'Antiemetic; Antihistamine', indications: 'Nausea; Vomiting; Vertigo', adultDose: '25-50 mg slow IVP or IM', pedsDose: '1 mg/kg slow IVP or IM (max 25 mg)', supplied: '50 mg/mL vial', routes: { emr: [], pcp: ['IM', 'IV'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 12, name: 'DiphenhydrAMINE/Benadryl', alerts: ['Elder Alert'], classification: 'Antihistamine', indications: 'Allergic reactions; Anaphylaxis; Dystonic reactions', adultDose: '25-50 mg IV/IM', pedsDose: '1 mg/kg IV/IM (max 50 mg)', supplied: '50 mg/mL vial', routes: { emr: [], pcp: ['IM', 'IV'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 13, name: 'Entonox/Nitrous Oxide', alerts: [], classification: 'Analgesic gas', indications: 'Moderate to severe pain', adultDose: 'Self-administered via mouthpiece', pedsDose: 'Self-administered (if able to comply)', supplied: '50% N2O, 50% O2 cylinder', routes: { emr: ['Inhaled'], pcp: ['Inhaled'], acp: ['Inhaled'], ccp: ['Inhaled'] } },
    { id: 14, name: 'EPINEPHrine/Adrenalin', alerts: ['High Alert'], classification: 'Sympathomimetic; Catecholamine', indications: 'Anaphylaxis; Severe Bronchospasm; Croup; Cardiac Arrest', adultDose: 'Anaphylaxis: 0.3-0.5 mg (1:1000) IM. Arrest: 1 mg (1:10,000) IV/IO every 3-5 min.', pedsDose: 'Anaphylaxis: 0.01 mg/kg (1:1000) IM (max 0.3 mg). Arrest: 0.01 mg/kg (1:10,000) IV/IO.', supplied: '1mg/mL (1:1000); 0.1mg/mL (1:10,000)', routes: { emr: ['IM'], pcp: ['IM', 'IV', 'IO'], acp: ['IM', 'IV', 'IO', 'Neb'], ccp: ['IM', 'IV', 'IO', 'Neb'] } },
    { id: 15, name: 'FentaNYL', alerts: ['High Alert'], classification: 'Opioid Analgesic', indications: 'Severe pain; Post-intubation sedation', adultDose: 'Pain: 25-100 mcg slow IV/IM/IN.', pedsDose: 'Pain: 1-2 mcg/kg slow IV/IM/IN.', supplied: '100 mcg/2 mL', routes: { emr: [], pcp: ['IM', 'IN', 'IV'], acp: ['IM', 'IN', 'IV'], ccp: ['IM', 'IN', 'IV'] } },
    { id: 16, name: 'Glucagon', alerts: [], classification: 'Hormone; Antihypoglycemic', indications: 'Hypoglycemia (no IV access); Beta-blocker overdose', adultDose: 'Hypoglycemia: 1 mg IM. BB Overdose: 3-10 mg IV.', pedsDose: 'Hypoglycemia: 0.5 mg (<20kg) or 1 mg (>20kg) IM.', supplied: '1 mg vial with diluent', routes: { emr: ['IM'], pcp: ['IM'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 17, name: 'Glucagon/BAQSIMI', alerts: [], classification: 'Hormone; Antihypoglycemic', indications: 'Hypoglycemia (no IV access)', adultDose: '3 mg (1 actuation) IN', pedsDose: '3 mg (1 actuation) IN', supplied: '3 mg single-use nasal device', routes: { emr: ['IN'], pcp: ['IN'], acp: ['IN'], ccp: ['IN'] } },
    { id: 18, name: 'Haloperidol/Haldol', alerts: ['Elder Alert'], classification: 'Antipsychotic', indications: 'Acute psychosis; Severe agitation', adultDose: '5-10 mg IM', pedsDose: 'Not indicated', supplied: '5 mg/mL vial', routes: { emr: [], pcp: [], acp: ['IM'], ccp: ['IM'] } },
    { id: 19, name: 'HYDROmorphone/Dilaudid', alerts: ['High Alert'], classification: 'Opioid Analgesic', indications: 'Severe pain', adultDose: '0.5-2 mg slow IV or IM', pedsDose: '0.01-0.02 mg/kg slow IV or IM', supplied: '2 mg/mL vial', routes: { emr: [], pcp: ['IM', 'IV'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 20, name: 'Ibuprofen/Advil', alerts: [], classification: 'NSAID', indications: 'Mild to moderate pain; Fever', adultDose: '200-800 mg PO every 6-8 hours', pedsDose: '10 mg/kg PO every 6-8 hours', supplied: '200 mg tablets, 100mg/5mL liquid', routes: { emr: ['PO'], pcp: ['PO'], acp: ['PO'], ccp: ['PO'] } },
    { id: 21, name: 'Ipratropium/Atrovent', alerts: [], classification: 'Anticholinergic; Bronchodilator', indications: 'Bronchospasm associated with COPD/Asthma', adultDose: '500 mcg nebulized with Salbutamol', pedsDose: '250-500 mcg nebulized with Salbutamol', supplied: '500 mcg/2 mL unit dose vial', routes: { emr: [], pcp: ['Neb'], acp: ['Neb'], ccp: ['Neb'] } },
    { id: 22, name: 'Ketamine/Ketalar', alerts: ['High Alert'], classification: 'Analgesic; Anesthetic', indications: 'Pain; Procedural sedation; Excited delirium', adultDose: 'Pain: 0.1-0.3 mg/kg IV or 0.5 mg/kg IM/IN. Sedation: 1-2 mg/kg IV or 4-5 mg/kg IM.', pedsDose: 'Pain: 0.1-0.3 mg/kg IV or 0.5 mg/kg IM/IN. Sedation: 1-2 mg/kg IV or 3-4 mg/kg IM.', supplied: '50 mg/mL, 100 mg/mL vials', routes: { emr: [], pcp: [], acp: ['IV', 'IM', 'IN'], ccp: ['IV', 'IM', 'IN'] } },
    { id: 23, name: 'Ketorolac/Toradol', alerts: [], classification: 'NSAID', indications: 'Moderate to severe pain', adultDose: '30 mg IV or 60 mg IM', pedsDose: 'Not indicated', supplied: '30 mg/mL vial', routes: { emr: [], pcp: ['IM'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 24, name: 'Lidocaine', alerts: ['High Alert'], classification: 'Antidysrhythmic; Anesthetic', indications: 'V-Fib/V-Tach; IO insertion pain', adultDose: 'Arrest: 1-1.5 mg/kg IV/IO. IO Pain: 20-40 mg IO prior to flush.', pedsDose: 'Arrest: 1 mg/kg IV/IO. IO Pain: 0.5 mg/kg IO.', supplied: '2% (20 mg/mL)', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 25, name: 'LORazepam/Ativan', alerts: ['High Alert'], classification: 'Benzodiazepine', indications: 'Seizures; Anxiety; Sedation', adultDose: 'Seizures: 2-4 mg slow IV/IM. Sedation: 1-2 mg IV.', pedsDose: 'Seizures: 0.05-0.1 mg/kg slow IV/IM.', supplied: '2 mg/mL, 4 mg/mL vials', routes: { emr: [], pcp: ['IM', 'IV'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 26, name: 'Magnesium Sulfate', alerts: ['High Alert'], classification: 'Electrolyte; Anticonvulsant', indications: 'Eclampsia; Torsades de Pointes; Severe asthma', adultDose: 'Eclampsia: 4-6 g IV over 20 min. TdP: 1-2 g IV. Asthma: 2 g IV over 20 min.', pedsDose: 'Asthma: 25-50 mg/kg IV over 20 min (max 2 g).', supplied: '50% solution (5g/10mL)', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 27, name: 'MethylPREDNISolone/Solu-MEDROL', alerts: [], classification: 'Corticosteroid', indications: 'Anaphylaxis; Asthma; COPD', adultDose: '125 mg IV/IM', pedsDose: '1-2 mg/kg IV/IM (max 125 mg)', supplied: '125 mg vial', routes: { emr: [], pcp: ['IM'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 28, name: 'Midazolam/Versed', alerts: ['High Alert'], classification: 'Benzodiazepine', indications: 'Seizures; Sedation; Agitation', adultDose: 'Seizures: 5-10 mg IM/IN or 2.5-5 mg IV. Sedation: 1-2.5 mg IV.', pedsDose: 'Seizures: 0.2 mg/kg IM/IN or 0.1 mg/kg IV.', supplied: '5 mg/mL vial', routes: { emr: [], pcp: ['IM', 'IN', 'IV'], acp: ['IM', 'IN', 'IV'], ccp: ['IM', 'IN', 'IV'] } },
    { id: 29, name: 'Morphine', alerts: ['High Alert'], classification: 'Opioid Analgesic', indications: 'Severe pain; ACS-related pain', adultDose: '2-5 mg slow IV every 5-10 min', pedsDose: '0.1 mg/kg slow IV every 5-10 min', supplied: '10 mg/mL vial', routes: { emr: [], pcp: ['IM', 'IV'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 30, name: 'Naloxone/Narcan', alerts: ['High Alert'], classification: 'Opioid Antagonist', indications: 'Opioid overdose with respiratory depression', adultDose: '0.4-2 mg IV/IM/IN, titrate to respirations', pedsDose: '0.1 mg/kg IV/IM/IN', supplied: '0.4 mg/mL, 1 mg/mL vials; 4 mg/0.1mL nasal spray', routes: { emr: ['IM', 'IN'], pcp: ['IM', 'IN', 'IV'], acp: ['IM', 'IN', 'IV'], ccp: ['IM', 'IN', 'IV'] } },
    { id: 31, name: 'Naproxen/Aleve', alerts: [], classification: 'NSAID', indications: 'Mild to moderate pain', adultDose: '220-440 mg PO initial, then 220 mg every 8-12 hours', pedsDose: 'Not commonly used', supplied: '220 mg tablets', routes: { emr: ['PO'], pcp: ['PO'], acp: ['PO'], ccp: ['PO'] } },
    { id: 32, name: 'NitroGLYCERIN/Glyceryl Trinitrate', alerts: ['High Alert'], classification: 'Vasodilator; Nitrate', indications: 'ACS; Acute cardiogenic pulmonary edema', adultDose: '0.4 mg SL every 5 min; 1-2 inches paste', pedsDose: 'Not indicated', supplied: '0.4 mg/spray; 0.4 mg tablets; 2% ointment', routes: { emr: ['SL', 'Topical'], pcp: ['SL', 'Topical'], acp: ['SL', 'Topical', 'IV'], ccp: ['SL', 'Topical', 'IV'] } },
    { id: 33, name: 'Norepinephrine/Levophed', alerts: ['High Alert'], classification: 'Vasopressor; Catecholamine', indications: 'Cardiogenic/Septic shock; Post-ROSC hypotension', adultDose: '0.01-2 mcg/kg/min IV infusion, titrate to effect', pedsDose: '0.05-2 mcg/kg/min IV infusion, titrate to effect', supplied: '1 mg/mL in 4 mL vial', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 34, name: 'Ondansetron/Zofran', alerts: [], classification: 'Antiemetic', indications: 'Nausea; Vomiting', adultDose: '4-8 mg IV/IM/PO', pedsDose: '0.15 mg/kg IV/IM/PO (max 4 mg)', supplied: '4 mg/2 mL vial; 4 mg ODT', routes: { emr: [], pcp: ['PO'], acp: ['PO', 'IM', 'IV'], ccp: ['PO', 'IM', 'IV'] } },
    { id: 35, name: 'Oxytocin/Syntocinon', alerts: ['High Alert'], classification: 'Hormone', indications: 'Postpartum hemorrhage', adultDose: '10 units IM; 10-40 units in 1L NS IV infusion', pedsDose: 'Not indicated', supplied: '10 units/mL vial', routes: { emr: [], pcp: ['IM'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 36, name: 'Salbutamol/Ventolin', alerts: [], classification: 'Sympathomimetic; Bronchodilator', indications: 'Bronchospasm; Hyperkalemia', adultDose: '2.5-5 mg nebulized', pedsDose: '2.5 mg nebulized', supplied: '5 mg/mL solution', routes: { emr: ['Neb'], pcp: ['Neb'], acp: ['Neb'], ccp: ['Neb'] } },
    { id: 37, name: 'Sodium Bicarbonate', alerts: [], classification: 'Alkalinizing agent; Buffer', indications: 'Metabolic acidosis; TCA overdose; Hyperkalemia', adultDose: '1 mEq/kg IV push', pedsDose: '1 mEq/kg IV push', supplied: '8.4% (50 mEq/50 mL) pre-filled syringe', routes: { emr: [], pcp: [], acp: ['IV', 'IO'], ccp: ['IV', 'IO'] } },
    { id: 38, name: 'Thiamine/Vitamin B1', alerts: [], classification: 'Vitamin', indications: 'Coma of unknown origin; Alcoholism; Delirium tremens', adultDose: '100 mg IV/IM', pedsDose: 'Not commonly used', supplied: '100 mg/mL vial', routes: { emr: [], pcp: ['IM'], acp: ['IM', 'IV'], ccp: ['IM', 'IV'] } },
    { id: 39, name: 'Tranexamic Acid/Cyklokapron', alerts: [], classification: 'Antifibrinolytic', indications: 'Significant hemorrhage in trauma', adultDose: '1 g IV over 10 minutes', pedsDose: '15 mg/kg IV over 10 minutes (max 1 g)', supplied: '1 g/10 mL vial', routes: { emr: [], pcp: [], acp: ['IV'], ccp: ['IV'] } },
];

const medListContainer = document.getElementById('medication-list');
const medDetailsContainer = document.getElementById('medication-details');
const welcomeMessage = document.getElementById('welcome-message');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

let activeFilter = 'all';
let currentSearchTerm = '';
let selectedMedId = null;

const renderMedList = () => {
    medListContainer.innerHTML = '';
    const filteredMeds = medications.filter(med => {
        const searchMatch = med.name.toLowerCase().includes(currentSearchTerm.toLowerCase());
        const alertMatch = activeFilter === 'all' || med.alerts.includes(activeFilter);
        return searchMatch && alertMatch;
    });

    if(filteredMeds.length === 0){
        medListContainer.innerHTML = `<p class="p-4 text-center text-gray-500">No medications found.</p>`;
    } else {
        filteredMeds.forEach(med => {
            const listItem = document.createElement('div');
            listItem.className = `med-list-item p-4 cursor-pointer border-b border-[var(--border-color)] ${med.id === selectedMedId ? 'active' : ''}`;
            listItem.dataset.id = med.id;

            let alertHtml = med.alerts.map(alert => {
                const alertClass = alert === 'High Alert' ? 'high-alert' : 'elder-alert';
                return `<span class="alert-badge ${alertClass}">${alert}</span>`;
            }).join(' ');

            listItem.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-semibold">${med.name.split('/')[0]}</span>
                    <div class="flex gap-1">${alertHtml}</div>
                </div>
                <p class="text-sm text-[var(--text-light)]">${med.name.split('/').slice(1).join('/')}</p>
            `;
            listItem.addEventListener('click', () => {
                selectedMedId = med.id;
                renderMedDetails(med.id);
                renderMedList(); // Re-render list to update active item highlight
            });
            medListContainer.appendChild(listItem);
        });
    }
};

const renderMedDetails = (id) => {
    const med = medications.find(m => m.id === id);
    if (!med) return;

    welcomeMessage.classList.add('hidden');
    medDetailsContainer.classList.remove('hidden');

    let alertHtml = med.alerts.map(alert => {
        const alertClass = alert === 'High Alert' ? 'high-alert' : 'elder-alert';
        return `<span class="alert-badge ${alertClass}">${alert}</span>`;
    }).join(' ');

    const routesHtml = `
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="p-3 font-semibold text-sm">Provider</th>
                        <th class="p-3 font-semibold text-sm">Approved Routes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b"><td class="p-3 font-medium">EMR</td><td class="p-3">${med.routes.emr.join(', ') || 'N/A'}</td></tr>
                    <tr class="border-b"><td class="p-3 font-medium">PCP/ICP</td><td class="p-3">${med.routes.pcp.join(', ') || 'N/A'}</td></tr>
                    <tr class="border-b"><td class="p-3 font-medium">ACP</td><td class="p-3">${med.routes.acp.join(', ') || 'N/A'}</td></tr>
                    <tr><td class="p-3 font-medium">CCP</td><td class="p-3">${med.routes.ccp.join(', ') || 'N/A'}</td></tr>
                </tbody>
            </table>
        </div>
    `;

    medDetailsContainer.innerHTML = `
        <div class="space-y-6">
            <div>
                <div class="flex flex-wrap items-center gap-2 mb-2">
                    <h2 class="text-3xl font-bold text-[var(--text-dark)]">${med.name}</h2>
                    ${alertHtml}
                </div>
                <p class="text-lg text-[var(--text-light)] font-medium">${med.classification}</p>
            </div>

            <div class="content-card">
                <h3 class="text-xl font-semibold mb-3 border-b pb-2">EMS Indications</h3>
                <ul class="list-disc list-inside space-y-1 text-[var(--text-light)]">
                    ${med.indications.split('; ').map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="content-card">
                    <h3 class="text-xl font-semibold mb-3 border-b pb-2">Adult / Elderly Dosing</h3>
                    <p class="text-[var(--text-light)] whitespace-pre-wrap">${med.adultDose}</p>
                </div>
                <div class="content-card">
                    <h3 class="text-xl font-semibold mb-3 border-b pb-2">Pediatric Dosing</h3>
                    <p class="text-[var(--text-light)] whitespace-pre-wrap">${med.pedsDose}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="content-card">
                     <h3 class="text-xl font-semibold mb-3 border-b pb-2">Concentration Supplied</h3>
                    <p class="text-[var(--text-light)] whitespace-pre-wrap">${med.supplied}</p>
                </div>
                 <div class="content-card">
                     <h3 class="text-xl font-semibold mb-3 border-b pb-2">Provider Routes</h3>
                    ${routesHtml}
                </div>
            </div>

        </div>
    `;
};

searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    renderMedList();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add 'active' to the clicked button
        btn.classList.add('active');

        if (btn.id === 'filter-high-alert') {
            activeFilter = 'High Alert';
        } else if (btn.id === 'filter-elder-alert') {
            activeFilter = 'Elder Alert';
        } else {
            activeFilter = 'all';
        }
        renderMedList();
    });
});

const init = () => {
    // Ensure the "All" button is active by default if it exists
    const filterAllButton = document.getElementById('filter-all');
    if (filterAllButton) {
        filterAllButton.classList.add('active');
    }
    renderMedList();
};

init();

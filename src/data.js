// src/data.js

export const labTechniques = [
    { id: 'sds-page', title: 'SDS-PAGE', icon: '🧬', comingSoon: false },
    { id: 'dna-gel', title: 'DNA Gel Electrophoresis', icon: '🧪', comingSoon: true },
    { id: 'pcr', title: 'Polymerase Chain Reaction', icon: '⚗️', comingSoon: true },
    { id: 'qpcr', title: 'qPCR', icon: '📊', comingSoon: false },
    { id: 'ph', title: 'pH', icon: '💧', comingSoon: true },
    { id: 'spec', title: 'OD and Spectrophotometer', icon: '🔦', comingSoon: true },
    { id: 'rt-pcr', title: 'RT-PCR', icon: '🧬', comingSoon: true },
    { id: 'elisa', title: 'ELISA', icon: '🧫', comingSoon: true },
    { id: 'western', title: 'Western Blotting', icon: '🩹', comingSoon: true },
    { id: 'cloning', title: 'Cloning', icon: '🐑', comingSoon: true }
];

export const libraryArticles = [
    {
        id: 'trichinellosis',
        title: 'Trichinellosis: A zoonosis that still requires vigilance',
        author: 'Ivana Mitic, Sasa Vasilev, Alisa Gruden-Movsesijan',
        university: 'University of Belgrade',
        journal: 'Plos Neglected Tropical Diseases',
        year: 'Jan, 2026',
        comingSoon: false
    }
];

export const articleSets = {
    'trichinellosis': [
        { id: 'data/library/trichinellosis/Set-1.json', title: 'History and Life Cycle' },
        { id: 'data/library/trichinellosis/Set-2.json', title: 'Epidemiology' },
        { id: 'data/library/trichinellosis/Set-3.json', title: 'Pathophysiology' },
        { id: 'data/library/trichinellosis/Set-4.json', title: 'Diagnosis' },
        { id: 'data/library/trichinellosis/Set-5.json', title: 'Clinical Manifestations' },
        { id: 'data/library/trichinellosis/Set-6.json', title: 'Treatment and Prevention' }
    ]
};

// "Գրականություն" բաժնի ենթաբաժինները (կատեգորիաները)
export const literatureCategories = [
    { id: 'all', label: 'Բոլորը' },
    { id: 'poetry', label: 'Պոեզիա' },
    { id: 'fables', label: 'Առակներ' },
    { id: 'fairytales', label: 'Հեքիաթներ' },
    { id: 'childrens-poems', label: 'Մանկական բանաստեղծություններ' },
    { id: 'riddles', label: 'Հանելուկներ' },
];

// Ադմինի ֆորմայում "Բոլորը" ընտրանքը իմաստ չունի (նյութը պիտի ունենա կոնկրետ կատեգորիա)
export const literatureFormCategories = literatureCategories.filter(c => c.id !== 'all');

export const getCategoryLabel = (id) =>
    literatureCategories.find(c => c.id === id)?.label || id;

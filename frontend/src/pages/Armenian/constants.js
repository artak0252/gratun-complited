// "Հայ և հայկական" բաժնի ենթաբաժինները (կատեգորիաները)
export const armenianCategories = [
          { id: 'general', label: 'Ընդհանուր' },
          { id: 'literature', label: 'Գրականություն' },
          { id: 'history', label: 'Պատմություն' },
          { id: 'music', label: 'Երաժշտություն' },
          { id: 'art', label: 'Արվեստ' },
          { id: 'culture', label: 'Մշակույթ (հոգևոր)' },
          { id: 'celebrities', label: 'Հայ հայտնիներ' },
];

// Ադմինի ֆորմայում ուրիշ ցանկ պետք չէ, category-ները արդեն բոլորը կոնկրետ են
export const armenianFormCategories = armenianCategories;

export const getCategoryLabel = (id) =>
          armenianCategories.find(c => c.id === id)?.label || id;
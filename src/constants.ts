export interface Trainer {
  name: string;
  role: string;
  img: string;
  achievements: string[];
}

export const TRAINERS: Trainer[] = [
  {
    name: 'Rastislav Babinčák',
    role: 'Hlavný tréner',
    img: '/images/Babinčák.jpg',
    achievements: [
      '13 násobný Majster SR',
      'Tréner 2. Triedy',
      'Rozhodca licencie A WAKO',
    ],
  },
  {
    name: 'Šimon Motiľ',
    role: 'Tréner',
    img: '/images/Motíľ.jpg',
    achievements: [],
  },
  {
    name: 'Dominika Sakačová',
    role: 'Trénerka',
    img: '/images/Sakačová.jpg',
    achievements: [],
  },
];

export const GALLERY_IMAGES = [
  // SEM pridávaj svoje fotky z galérie. 
  // Všetky musia byť nahraté v priečinku: public/images/
  { id: 1, url: '/images/galeria1.jpg',  }, 
  { id: 2, url: '/images/galeria2.jpg',  },
  { id: 3, url: '/images/galeria3.jpg',  },
  { id: 4, url: '/images/galeria4.jpg',  },
  { id: 5, url: '/images/galeria5.jpg',  },
  { id: 6, url: '/images/galeria6.jpg',  },
  { id: 7, url: '/images/galeria7.jpg',  },
  { id: 8, url: '/images/galeria8.jpg',  },
  { id: 9, url: '/images/galeria9.jpg',  },
  { id: 10, url: '/images/galeria10.jpg',  },
  { id: 11, url: '/images/galeria11.jpg',  },
  { id: 12, url: '/images/galeria12.jpg',  },
  { id: 13, url: '/images/galeria13.jpg',  },
  { id: 14, url: '/images/galeria14.jpg',  },
  { id: 15, url: '/images/galeria15.jpg',  },
  { id: 16, url: '/images/galeria16.jpg',  },
  { id: 17, url: '/images/galeria17.jpg',  },
  { id: 18, url: '/images/galeria18.jpg',  },
  { id: 19, url: '/images/galeria19.jpg',  },
  { id: 20, url: '/images/galeria20.jpg',  },
  { id: 21, url: '/images/galeria21.jpg',  },


  /*
  Ak chceš pridať ďalšiu, skopíruj tento riadok nižšie:
  { id: 7, url: '/images/tvoj_subor.jpg', alt: 'Popis fotky' },
  */
];

export const EQUIPMENT_IMAGES = [
  // SEM pridávaj fotky vybavenia posilňovne.
  // Všetky musia byť nahraté v priečinku: public/images/
  { id: 1, url: '/images/vybavenie1.jpg', caption: 'GYM' },
  { id: 2, url: '/images/vybavenie2.jpg', caption: 'GYM' },
  { id: 3, url: '/images/vybavenie3.jpg', caption: 'GYM' },


  /*
  Ak chceš pridať ďalšiu, skopíruj tento riadok nižšie:
  { id: 7, url: '/images/tvoj_subor.jpg', caption: 'Popis vybavenia' },
  */
];

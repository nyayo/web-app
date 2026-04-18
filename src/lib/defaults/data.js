export const createDefaultPagination = (limit = 5, extra = {}) => ({
  page: 1,
  totalPages: 1,
  limit,
  nextPage: null,
  prevPage: null,
  ...extra,
});

export const createDefaultUsersResponse = () => ({
  data: [],
  pagination: createDefaultPagination(5, { totalUsers: 0 }),
});

export const createDefaultThemesResponse = () => ({
  data: [],
  pagination: createDefaultPagination(5, { totalThemes: 0 }),
});

export const createDefaultClickStats = () => ({
  clickCountsByDate: {},
  totalClicks: 0,
  totalClicksByType: {
    qr: 0,
    nfc: 0,
    web: 0,
  },
});

export const createDefaultTheme = () => ({
  color: {
    font: {
      primary: '#182d30',
      secondary: '#2f575d',
    },
    background: '#dee1dd',
    contactIcons: {
      font: '#182d30',
      background: '#dee1dd',
    },
    socialIcons: {
      font: '',
      background: '',
    },
    vCardBtn: {
      font: '#dee1dd',
      background: '#182d30',
    },
  },
  display: {
    logo: true,
    phone: true,
    sms: true,
    email: true,
    web: true,
    address: true,
    map: true,
    vCardBtn: true,
  },
  align: {
    logo: 'start',
    avatar: 'center',
    heading: 'center',
    bio: 'center',
    socialIcons: 'start',
  },
  logo: {
    size: {
      height: 30,
      width: 0,
    },
    format: {
      png: '',
      webp: '',
    },
  },
  name: '',
  themeId: '',
});

export const createDefaultVCard = (userId = '') => ({
  userId,
  person: {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthday: '',
    pronouns: '',
  },
  professional: {
    title: '',
    company: '',
    role: '',
    bio: '',
  },
  contact: {
    phone: {
      number: '',
      countryCode: '',
      extension: '',
    },
    email: '',
    web: '',
    file: {
      url: '',
      name: '',
    },
  },
  location: {
    street: '',
    storey: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    timeZone: '',
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
  },
  socialMedia: {
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    pinterest: '',
    github: '',
  },
  avatar: {
    size: {
      height: 0,
      width: 0,
    },
    format: {
      png: '',
      webp: '',
    },
  },
  cover: {
    size: {
      height: 0,
      width: 0,
    },
    format: {
      png: '',
      webp: '',
    },
  },
});

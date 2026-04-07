// Fixed Maryville locations + custom option (prototype)
export const LOCATIONS = [
  'Donius University Center',
  'Gander Hall',
  'Walker Hall',
  'Other (custom)',
];

// Sample food posts for Home Feed
export const MOCK_FOOD_POSTS = [
  {
    id: '1',
    title: 'SGA Meeting Leftovers',
    location: 'DUC, Room 204',
    building: 'Donius University Center',
    timerMins: 24,
    tag: 'Vegetarian',
    lowQuantity: false,
    imagePlaceholder: true, // no real image in prototype
  },
  {
    id: '2',
    title: 'Faculty Mixer Pastries',
    location: 'Walker Hall, Lobby',
    building: 'Walker Hall',
    timerMins: 5,
    tag: null,
    lowQuantity: true,
    imagePlaceholder: true,
  },
  {
    id: '3',
    title: 'Club Fair Snacks',
    location: 'Gander Hall, Main Room',
    building: 'Gander Hall',
    timerMins: 45,
    tag: 'Vegetarian',
    lowQuantity: false,
    imagePlaceholder: true,
  },
];

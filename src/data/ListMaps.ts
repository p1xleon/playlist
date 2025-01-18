export const listOptions = [
  {value: 'backlog', label: 'Backlog'},
  {value: 'wishlist', label: 'Wishlist'},
  {value: 'playlist', label: 'Playing'},
  {value: 'completed', label: 'Completed'},
  {value: 'dropped', label: 'Dropped'},
];

export const listLabels: {[key: string]: string} = {
  backlog: 'Backlog',
  wishlist: 'Wishlist',
  playlist: 'Playing',
  completed: 'Completed',
  dropped: 'Dropped',
};

export const listIcons: {[key: string]: string} = {
  backlog: 'progress-alert',
  playlist: 'motion-play-outline',
  wishlist: 'bookmark-outline',
  completed: 'checkbox-marked-circle-outline',
  dropped: 'minus-circle-outline',
};

export const listDesc: {[key: string]: string} = {
  backlog: 'Games to Play',
  playlist: 'Currently Playing',
  wishlist: 'Wishlisted Games',
  completed: 'Completed Games',
  dropped: 'Dropped/Ignored Games',
};

export const listColors: {[key: string]: string} = {
  backlog: '#FA5F55',
  playlist: '#89CFF0',
  wishlist: '#F33A6A',
  completed: '#0BDA51',
  dropped: '#F4C430',
};

export const listSort: {[key: string]: string} = {
  name: 'Name',
  addedDate: 'Date Added',
  listName: 'List',
};

export const dashList: {[key: string]: string} = {
  backlog: 'Games to Play Next',
  playlist: 'Currently Playing',
  completed: 'Recently Completed',
  wishlist: 'Wishlisted',
  dropped: 'Dropped/Ignored Games',
};

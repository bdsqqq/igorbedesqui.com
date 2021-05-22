const useRandomFromArray = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default useRandomFromArray;

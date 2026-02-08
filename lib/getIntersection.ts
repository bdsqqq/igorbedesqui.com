// Thanks https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript/16227294#16227294

const getIntersection = (a: string[], b: string[]): string[] => {
  let t;
  if (b.length > a.length) (t = b), (b = a), (a = t);

  const lowerCaseA = a.map((item) => item.toLowerCase());
  const lowerCaseB = b.map((item) => item.toLowerCase());
  return lowerCaseA.filter(function (e) {
    return lowerCaseB.indexOf(e.toLowerCase()) > -1;
  });
};

export default getIntersection;

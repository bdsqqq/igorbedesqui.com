// Thanks https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript/16227294#16227294

const getIntersection = (a: any[], b: any[]) => {
  var t;
  if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter

  let lowerCaseA = a.map((item) => item.toLowerCase());
  let lowerCaseB = b.map((item) => item.toLowerCase());
  return lowerCaseA.filter(function (e) {
    return lowerCaseB.indexOf(e.toLowerCase()) > -1;
  });
};

export default getIntersection;

export const responseUserObject = (object: Object, prors: Array<string>) => {
	return Object.keys(object).reduce((acc, key) => {
	  if (!prors.includes(key)) {
		acc[key] = object[key];
	  }
	  return acc;
	}, {});
  };
  
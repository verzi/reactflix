const api = 'https://api.themoviedb.org/3';

// Esta api key la expongo dado que es gratuita y sólo para caso de estudio. Lo correcto es almacenarla en un archivo .env
const key = '558182696c08d8f1f28fa0965916da2e';

const defaultContent = {
  api_key: key,
  language: 'es-ES'
};

function queryString(obj) {
  return Object.entries(obj)
    .map(([index, val]) => `${index}=${val}`)
    .join('&');
}

export default async function request(url, content = {}, debug = false) {
  const obj = { ...defaultContent, ...content };

  const response = await fetch(`${api}/${url}?${queryString(obj)}`);
  const data = await (debug ? response.status : response.json());

  return data;
}

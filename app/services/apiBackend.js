const api = 'http://192.168.0.94:8080/mri-api';

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

export default async function request(url, content = {}, method = "GET", header = {}) {
  let data = false;
  if (method === "GET") {
    const response = await fetch(`${api}/${url}`, 
    { 
      method, 
      headers: {"Content-type": "application/json","Accept": "application/json", ...header}
    }
  );
    data = await response.json();
  } else {
    const response = await fetch(`${api}/${url}`, 
      { 
        method, 
        headers: {"Content-type": "application/json","Accept": "application/json", ...header},
        body: JSON.stringify(content) 
      }
    );
    data = await response.json();
  }
  return data;
}

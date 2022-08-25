const localHostPort: string = '8081';
const localHostUrl: string = `http://localhost:${localHostPort}/api/`;
const remoteHostUrl: string = '';

const apiBaseUrl: string = localHostUrl;

const apiEndpoints = {
    produto: apiBaseUrl + 'produto',
    compra: apiBaseUrl + 'compra',
    statusCompra: apiBaseUrl + 'statusCompra',
    tipoPagamento: apiBaseUrl + 'tipoPagamento',
    compraProduto: apiBaseUrl + 'compraProduto',
    baseUrl: apiBaseUrl
}

export default apiEndpoints;
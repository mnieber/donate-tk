import { GraphQLClient } from 'graphql-request';
import { flags } from 'src/app/flags';

function _createClient() {
  const authToken = flags.useMockServer
    ? undefined
    : localStorage.getItem('authToken');

  const url = flags.useMockServer
    ? `http://localhost:4000`
    : `http://${window.location.hostname}:8000/graphql/`;

  return new GraphQLClient(url, {
    headers: authToken
      ? {
          Authorization: 'JWT ' + authToken,
        }
      : {},
  });
}

let _graphqlClient = _createClient();

export const graphqlClient = () => _graphqlClient;
export const setToken = (authToken: string) => {
  localStorage.setItem('authToken', authToken);
  _graphqlClient = _createClient();
};

export function doQuery(query: string, variables: any) {
  return graphqlClient().request(query, variables);
}
import { currentBackend } from '../backends/backend';
import { getIntegrationProvider } from '../integrations';
import { selectIntegration } from '../reducers';
import { WAIT_UNTIL_SERVICE } from '../redux/middleware/waitService';
import { loadEntries, ENTRIES_SUCCESS } from './entries';

/*
 * Contant Declarations
 */
export const SEARCH_ENTRIES_REQUEST = 'SEARCH_ENTRIES_REQUEST';
export const SEARCH_ENTRIES_SUCCESS = 'SEARCH_ENTRIES_SUCCESS';
export const SEARCH_ENTRIES_FAILURE = 'SEARCH_ENTRIES_FAILURE';

export const QUERY_REQUEST = 'INIT_QUERY';
export const QUERY_SUCCESS = 'QUERY_OK';
export const QUERY_FAILURE = 'QUERY_ERROR';

export const SEARCH_CLEAR = 'SEARCH_CLEAR';

/*
 * Simple Action Creators (Internal)
 * We still need to export them for tests
 */
export function searchingEntries(searchTerm) {
  return {
    type: SEARCH_ENTRIES_REQUEST,
    payload: { searchTerm },
  };
}

export function searchSuccess(searchTerm, entries, page) {
  return {
    type: SEARCH_ENTRIES_SUCCESS,
    payload: {
      searchTerm,
      entries,
      page,
    },
  };
}

export function searchFailure(searchTerm, error) {
  return {
    type: SEARCH_ENTRIES_FAILURE,
    payload: {
      searchTerm,
      error,
    },
  };
}

export function querying(namespace, collection, searchFields, searchTerm) {
  return {
    type: QUERY_REQUEST,
    payload: {
      namespace,
      collection,
      searchFields,
      searchTerm,
    },
  };
}

export function querySuccess(namespace, collection, searchFields, searchTerm, response) {
  return {
    type: QUERY_SUCCESS,
    payload: {
      namespace,
      collection,
      searchFields,
      searchTerm,
      response,
    },
  };
}

export function queryFailure(namespace, collection, searchFields, searchTerm, error) {
  return {
    type: QUERY_SUCCESS,
    payload: {
      namespace,
      collection,
      searchFields,
      searchTerm,
      error,
    },
  };
}

/*
 * Exported simple Action Creators
 */

export function clearSearch() {
  return { type: SEARCH_CLEAR };
}


/*
 * Exported Thunk Action Creators
 */

// SearchEntries will search for complete entries in all collections.
export function searchEntries(searchTerm, page = 0) {
  return (dispatch, getState) => {
    const state = getState();
    let collections = state.collections.keySeq().toArray();
    collections = collections.filter(collection => selectIntegration(state, collection, 'search'));
    const integration = selectIntegration(state, collections[0], 'search');
    if (!integration) {
      dispatch(searchFailure(searchTerm, 'Search integration is not configured.'));
    }
    const provider = integration ?
      getIntegrationProvider(state.integrations, currentBackend(state.config).getToken, integration)
      : currentBackend(state.config);
    dispatch(searchingEntries(searchTerm));
    provider.search(collections, searchTerm, page).then(
      response => dispatch(searchSuccess(searchTerm, response.entries, response.pagination)),
      error => dispatch(searchFailure(searchTerm, error))
    );
  };
}

// Instead of searching for complete entries, query will search for specific fields
// in specific collections and return raw data (no entries).
export function query(namespace, collection, searchFields, searchTerm) {
  return (dispatch, getState) => {
    const state = getState();
    const integration = selectIntegration(state, collection, 'search');
    dispatch(querying(namespace, collection, searchFields, searchTerm));
    if (!integration) {
      if (state.entries.hasIn(['pages', collection, 'ids'])) {
        // TODO: Response format
        // {
        //   "hits": [
        //     {
        //       "slug": "zeno-rocha",
        //       "path": "zeno-rocha",
        //       "data": {/* entry data */},
        //     },
        //     {
        //       "slug": "senongo-akpem",
        //       "path": "senongo-akpem",
        //       "data": {/* entry data */},
        //     }
        //   ],
        //   "query": "zeno",
        // }
      } else {
        // Collection entries aren't loaded yet.
        // Dispatch loadEntries and wait before redispatching this action again.
        dispatch({
          type: WAIT_UNTIL_SERVICE,
          predicate: action => (action.type === ENTRIES_SUCCESS &&
                                action.payload.collection === collection),
          run: dispatch => dispatch(query(namespace, collection, searchFields, searchTerm)),
        });

        dispatch(loadEntries(state.collections.get(collection)));
      }

      // // Actually fire a request to eat a burger
    } else {
      const provider = getIntegrationProvider(state.integrations, currentBackend(state.config).getToken, integration);
      provider.searchBy(searchFields, collection, searchTerm).then(
        response => dispatch(querySuccess(namespace, collection, searchFields, searchTerm, response)),
        error => dispatch(queryFailure(namespace, collection, searchFields, searchTerm, error))
      );
    }
  };
}

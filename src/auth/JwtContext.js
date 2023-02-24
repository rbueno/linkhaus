import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  currentWorkspace: null,
  workspaces: null,
};

const reducer = (state, action) => {

  const isAuthenticated = action?.payload?.isAuthenticated;
  const workspaceSession = action?.payload?.workspaceSession;
    const user = workspaceSession?.user
    const currentWorkspace = workspaceSession?.currentWorkspace
    const workspaces = workspaceSession?.workspaces || []

  if (action.type === 'INITIAL') {
    console.log('===> auth INITIAL', {
      isInitialized: true,
      isAuthenticated,
      user,
      currentWorkspace,
      workspaces
    })
    return {
      isInitialized: true,
      isAuthenticated,
      user,
      currentWorkspace,
      workspaces
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user,
      currentWorkspace,
      workspaces
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user,
      currentWorkspace,
      workspaces
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      currentWorkspace: null,
      workspaces: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateWorkspaces: () => Promise.resolve(),
  switchWorkspace: () => Promise.resolve()
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      const workspaceId = storageAvailable ? localStorage.getItem('workspaceId') : '';
      console.log('=====> initialize accessToken', accessToken)
      console.log('=====> initialize workspaceId', workspaceId)
      console.log('=====> initialize isValidToken(accessToken)', isValidToken(accessToken))

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, workspaceId);

        const response = await axios.get('/v1/account');
        const { workspaceSession } = response.data;
        console.log('refresh workspaceSession ==>', workspaceSession)

        // eslint-disable-next-line no-unused-expressions
        workspaceSession && localStorage.setItem('workspaceId', workspaceSession.currentWorkspace?._id)
        updateWorkspaces(workspaceSession)

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            workspaceSession,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            workspaceSession: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          workspaceSession: null,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {

    const response = await axios.post('/v1/session', {
      email,
      password,
    });
    const { accessToken, workspaceSession } = response.data;
    console.log('login workspaceSession ==>', workspaceSession)

    setSession(accessToken, workspaceSession?.currentWorkspace?._id);

    dispatch({
      type: 'LOGIN',
      payload: {
        workspaceSession,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/v1/user', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, workspaceSession } = response.data;
    console.log('register workspaceSession ==>', workspaceSession)

    setSession(accessToken, workspaceSession?.currentWorkspace?._id);

    dispatch({
      type: 'REGISTER',
      payload: {
        workspaceSession,
      },
    });
  }, []);

  const switchWorkspace = useCallback(async (newWorkspaceIdId) => {
    if (localStorage.getItem('workspaceId') === newWorkspaceIdId) return
    localStorage.setItem('workspaceId', newWorkspaceIdId)
    initialize()
  }, [initialize])

  const updateWorkspaces = useCallback(async (workspaceSession) => {
    console.log('updateWorkspaces ==>', workspaceSession)
    if(!workspaceSession) return

    dispatch({
      type: 'INITIAL',
      payload: {
        isAuthenticated: true,
        workspaceSession
      },
    });
  }, [])

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      currentWorkspace: state.currentWorkspace,
      workspaces: state.workspaces,
      method: 'jwt',
      login,
      register,
      logout,
      updateWorkspaces,
      switchWorkspace
    }),
    [state.isAuthenticated, state.isInitialized, state.user, state.currentWorkspace, state.workspaces, login, logout, register, updateWorkspaces, switchWorkspace]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

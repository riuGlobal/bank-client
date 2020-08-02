import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { actions as registrationPageActions } from 'app/containers/RegistrationPage/slice';
import { actions as loginPageActions } from 'app/containers/LoginPage/slice';

// The initial state of the App container
export const initialState: ContainerState = {
  isCollapsedSidebar: false,
  isCollapsedDrawer: false,
  isLogged: false,
  token: {},
  user: {},
  currencies: [],
  messages: [],
  openedMessage: {},
  notifications: [],
};

const appSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    getCurrenciesRequestAction() {},
    getCurrenciesSuccessAction(state, action: PayloadAction<any>) {
      state.currencies = action.payload;
    },
    getCurrenciesErrorAction(state, action: PayloadAction<any>) {},
    getMessagesRequestAction() {},
    getMessagesSuccessAction(state, action: PayloadAction<any>) {
      state.messages = action.payload;
    },
    getMessagesErrorAction(state, action: PayloadAction<any>) {},
    openMessageAction(state, action: PayloadAction<any>) {
      state.openedMessage = action.payload;
    },

    readMessageRequestAction() {},
    readMessageSuccessAction(state) {
      state.messages.data.find(
        ({ uuid }) => uuid === state.openedMessage.uuid,
      ).readed = true;

      if (state.user?.userConfig.messageCount) {
        state.user.userConfig.messageCount -= 1;
      }
    },
    readMessageErrorAction(state, action: PayloadAction<any>) {},
    readMessagesRequestAction() {},
    readMessagesSuccessAction(state) {
      state.messages.data = state.messages.data.map(message => ({
        ...message,
        readed: true,
      }));

      if (state.user?.userConfig.messageCount) {
        state.user.userConfig.messageCount = 0;
      }
    },
    readMessagesErrorAction(state, action: PayloadAction<any>) {},
    getNotificationsRequestAction() {},
    getNotificationsSuccessAction(state, action: PayloadAction<any>) {
      state.notifications = action.payload;

      if (state.user?.userConfig.notificationCount) {
        state.user.userConfig.notificationCount = 0;
      }
    },
    getNotificationsErrorAction(state, action: PayloadAction<any>) {},
    checkEmailRequestAction(state, action: PayloadAction<any>) {},
    checkEmailSuccessAction(state, action: PayloadAction<any>) {},
    checkEmailErrorAction(state, action: PayloadAction<any>) {},
    checkEmailInvalidAction() {},
    logoutRequestAction() {},
    logoutSuccessAction() {},
    logoutErrorAction(state, action: PayloadAction<any>) {},
    toggleDrawerAction(state) {
      state.isCollapsedDrawer = !state.isCollapsedDrawer;
    },
    toggleSidebarAction(state) {
      state.isCollapsedSidebar = !state.isCollapsedSidebar;
    },
  },
  extraReducers: {
    [registrationPageActions.loginExpressSuccessAction.type]: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogged = true;
    },
    [loginPageActions.loginSuccessAction.type]: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogged = true;
    },
  },
});

export const { actions, reducer, name: sliceKey } = appSlice;

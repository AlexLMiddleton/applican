export const USER_LEVEL = "USER_LEVEL";

export const setUserLevel = () => async (dispatch, getState) => {
  const userCookie = decodeURIComponent(document.cookie).split(",");
  const userType = {};

  userType["id"] = userCookie[0].replace('SPAToken=j:{"id":', "");

  userType["level"] = userCookie[1]
    .split(":")[1]
    .replace('"', "")
    .replace('"}', "");

  console.log(userType);
  await dispatch({
    type: USER_LEVEL,
    payload: userType
  });
};

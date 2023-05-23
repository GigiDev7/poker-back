import usersService from "../services/users.js";

const login = async (req, res, next) => {
  try {
    const data = await usersService.login(req.body.email, req.body.password);
    res.cookie("token", data.token, { httpOnly: true });
    res.cookie("user", JSON.stringify(data.user));
    res.status(200).json({ user: data.user, token: data.token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const user = await usersService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export default { login, register, logout };

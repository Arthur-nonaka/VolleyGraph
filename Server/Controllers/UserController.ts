import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
  res.status(200).send("Get User");
};

export const createUser = (req: Request, res: Response) => {
  res.status(201).send("Create User");
};

export const updateUser = (req: Request, res: Response) => {
  res.status(200).send("Update User");
};

export const deleteUser = (req: Request, res: Response) => {
  res.status(200).send("Delete User");
};

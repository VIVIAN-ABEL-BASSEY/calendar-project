import { Request, Response } from "express";
import { TaskGroup } from "./taskGroup.model";

export const createTaskGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const userId = (req as any).userId;

    const group = await TaskGroup.create({
      name,
      userId
    });

    res.status(201).json({
      message: "Task group created successfully",
      group
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task group"
    });
  }
};

export const getUserTaskGroups = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const groups = await TaskGroup.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Task groups fetched successfully",
      groups
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task groups"
    });
  }
};
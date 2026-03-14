import { Request, Response } from "express";
import { Task } from "./task.model";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority, taskGroupId } = req.body;

    // userId will come from auth middleware
    const userId = (req as any).userId;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      taskGroupId,
      userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task"
    });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId }, // ensures users can only update their own tasks
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task"
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task"
    });
  }
};
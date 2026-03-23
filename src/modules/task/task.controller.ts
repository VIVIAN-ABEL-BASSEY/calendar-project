import { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "./task.model";
import { title } from "node:process";

// export const createTask = async (req: Request, res: Response) => {
//   try {
//     const { title, description, dueDate, priority, taskGroupId } = req.body;

//     // userId will come from auth middleware
//     const userId = (req as any).userId;

//     const task = await Task.create({
//       title,
//       description,
//       dueDate,
//       priority,
//       taskGroupId,
//       userId
//     });

//     res.status(201).json({
//       message: "Task created successfully",
//       task
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create task"
//     });
//   }
// };
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const task = await Task.create({
      ...req.body,
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
    const { status, groupId,search } = req.query;

    const filter: any = { userId };
    
    if (search && typeof search === "string") {
    filter.title = { $regex: search, $options: "i" }; // case-insensitive
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    // ✅ FIX 2: Convert groupId to ObjectId
    if (groupId && typeof groupId === "string") {
      filter.groupId = new mongoose.Types.ObjectId(groupId);
    }

    // console.log("FINAL FILTER:", filter); // debug

    const today = new Date();
    const overdueTasks = await Task.find({
     ...filter,
    dueDate: { $lt: today },
    status: { $ne: "completed" }
    })
  .populate("groupId", "name")
  .sort({ dueDate: 1 });

    const tasksWithDueDate = await Task.find({
    ...filter,
    dueDate: { $gte: today }
    })
  .populate("groupId", "name")
  .sort({ dueDate: 1 });

    const tasksWithoutDueDate = await Task.find({
    ...filter,
    dueDate: null
    })
    .populate("groupId", "name")
    .sort({ createdAt: -1 });

    const tasks = [...overdueTasks,...tasksWithDueDate, ...tasksWithoutDueDate];

    // const tasks = await Task.find(filter)
    //   .populate("groupId", "name").sort({ dueDate: 1, createdAt: -1 })

    
    // const tasks = await Task.find({ userId })
    // .populate("groupId", "name") // 👈 IMPORTANT
    // .sort({ createdAt: -1 });

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
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
    const { status, groupId,overdue, search, page = "1", limit = "10"  } = req.query;

    const filter: any = { userId };
    
    if (search && typeof search === "string") {
    // filter.title = { $regex: search, $options: "i" }; // case-insensitive
    filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } }
];
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    // ✅ FIX 2: Convert groupId to ObjectId
    if (groupId && typeof groupId === "string") {
      filter.groupId = new mongoose.Types.ObjectId(groupId);
    }
// console.log("FINAL FILTER:", filter); // debug
        if (overdue === "true") {
  const today = new Date();

  const overdueTasks = await Task.find({
    ...filter,
    dueDate: { $lt: today },
    status: { $ne: "completed" }
  })
    .populate("groupId", "name")
    .sort({ dueDate: 1 });

  return res.status(200).json({
    message: "Overdue tasks fetched successfully",
    tasks: overdueTasks
  });
}
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
    const allTasks = [...overdueTasks,...tasksWithDueDate, ...tasksWithoutDueDate];

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const paginatedTasks = allTasks.slice(skip, skip + limitNumber);

    res.status(200).json({
        message: "Tasks fetched successfully",
        totalTasks: allTasks.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(allTasks.length / limitNumber),
        tasks: paginatedTasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId
    }).populate("groupId", "name");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task"
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
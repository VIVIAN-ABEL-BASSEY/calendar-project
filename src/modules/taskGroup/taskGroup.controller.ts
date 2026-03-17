import { Request, Response } from "express";
import { TaskGroup } from "./taskGroup.model";
import { Task } from "../task/task.model"; 

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
export const updateTaskGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const updatedGroup = await TaskGroup.findOneAndUpdate(
      { _id: id, userId }, // ensures user owns the group
      req.body,
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({
        message: "Task group not found"
      });
    }

    res.status(200).json({
      message: "Task group updated successfully",
      group: updatedGroup
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task group"
    });
  }
};

// export const deleteTaskGroup = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).userId;
//     const { id } = req.params;

//     const deletedGroup = await TaskGroup.findOneAndDelete({
//       _id: id,
//       userId
//     });

//     if (!deletedGroup) {
//       return res.status(404).json({
//         message: "Task group not found"
//       });
//     }

//     res.status(200).json({
//       message: "Task group deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete task group"
//     });
//   }
// };

export const deleteTaskGroup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const deletedGroup = await TaskGroup.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deletedGroup) {
      return res.status(404).json({
        message: "Task group not found"
      });
    }

    // 🔥 IMPORTANT: remove group reference from tasks
    await Task.updateMany(
      { groupId: id, userId },
      { $set: { groupId: null } }
    );

    res.status(200).json({
      message: "Task group deleted and tasks ungrouped successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task group"
    });
  }
};
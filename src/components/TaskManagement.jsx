import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, TextField, Button, Typography, Card, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemType = {
  TASK: "task",
};

const TaskCard = ({ task, index, column, moveTask, deleteTask }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task, index, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.TASK,
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const sourceColumn = draggedItem.column;
      const targetColumn = column;

      if (dragIndex === hoverIndex && sourceColumn === targetColumn) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        moveTask(draggedItem, hoverIndex, targetColumn);

        draggedItem.index = hoverIndex;
        draggedItem.column = targetColumn;
      }
    },
  });

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        p: 2,
        mb: 2,
        cursor: 'move',
        '&:hover': { boxShadow: 2 }
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {task.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {task.desc}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip label="High Priority" color="secondary" size="small" />
        <DeleteIcon
          color="error"
          onClick={() => deleteTask(column, task.id)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Card>
  );
};

const Column = ({ column, tasks, moveTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      if (tasks.length === 0) {
        moveTask(item, 0, column);
      } else {
        moveTask(item, tasks.length, column);
      }
    },
  });

  return (
    <Box
      ref={drop}
      sx={{
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      <Typography
        variant="h6"
        color="primary"
        textTransform="uppercase"
        mb={2}
      >
        {column.charAt(0).toUpperCase() + column.slice(1)}
      </Typography>
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          column={column}
          moveTask={moveTask}
          deleteTask={deleteTask}
        />
      ))}
    </Box>
  );
};

const TaskManagement = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    completed: [],
    done: [],
  });
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  const handleAddTask = () => {
    if (taskName) {
      setTasks((prev) => ({
        ...prev,
        pending: [...prev.pending, {
          id: Date.now(),
          name: taskName,
          desc: taskDesc
        }],
      }));
      setTaskName("");
      setTaskDesc("");
    }
  };

  const handleDelete = (column, id) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((task) => task.id !== id),
    }));
  };

  const moveTask = (draggedItem, targetIndex, targetColumn) => {
    setTasks((prev) => {
      const sourceColumn = [...prev[draggedItem.column]];
      const targetColumnTasks = [...prev[targetColumn]];

      const [movedTask] = sourceColumn.splice(draggedItem.index, 1);

      targetColumnTasks.splice(targetIndex, 0, movedTask);

      return {
        ...prev,
        [draggedItem.column]: sourceColumn,
        [targetColumn]: targetColumnTasks,
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {/* Task Creation Section */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            mb: 4
          }}
        >
          <Typography
            variant="h5"
            mb={3}
            color="text.primary"
            fontWeight="bold"
            textAlign="center"
          >
            Create a New Task
          </Typography>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={3}
          >
            <TextField
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Task Description"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              sx={{
                alignSelf: { xs: 'stretch', md: 'flex-start' },
                p: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        {/* Task Columns Section */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={4}
          sx={{
            overflow: 'auto',
            maxHeight: '56vh',
          }}
        >
          {Object.entries(tasks).map(([column, columnTasks]) => (
            <>
              <Column
                column={column}
                tasks={columnTasks}
                moveTask={moveTask}
                deleteTask={handleDelete}
              />
            </>
          ))}
        </Box>
      </Box>
    </DndProvider>

  );
};

export default TaskManagement;
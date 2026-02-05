const express = require('express');
const router = express.Router();
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controller');

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;

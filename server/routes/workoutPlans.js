const express = require('express');
const WorkoutPlan = require('../models/WorkoutPlan');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const router = express.Router();

// --- GET ALL WORKOUT PLANS ---
// Fetches all workout plans created by the logged-in trainer.
// Used by the main "Planos de Treino" page.
router.get('/', auth, async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find({ trainer: req.userId })
      .populate('client', 'name email') // Adds client's name and email to the response
      .sort({ createdAt: -1 }); // Shows the newest plans first
    
    res.json(workoutPlans);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({ message: 'Erro ao buscar planos de treino', error: error.message });
  }
});

// --- GET A SINGLE WORKOUT PLAN BY ID ---
// Fetches detailed information for one specific plan.
router.get('/:id', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({ 
      _id: req.params.id, 
      trainer: req.userId 
    }).populate('client', 'name email');

    if (!workoutPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado.' });
    }
    
    res.json(workoutPlan);
  } catch (error) {
    console.error(`Error fetching workout plan ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao buscar o plano de treino', error: error.message });
  }
});

// --- CREATE A NEW WORKOUT PLAN ---
// Creates a new plan from data sent by the frontend (e.g., NewWorkoutPlanDialog).
router.post('/', auth, async (req, res) => {
  try {
    const workoutData = { ...req.body, trainer: req.userId };
    const workoutPlan = new WorkoutPlan(workoutData);
    await workoutPlan.save();
    
    // Create an activity log for the new plan
    if (workoutPlan.client) {
      const activity = new Activity({
        client: workoutPlan.client,
        trainer: req.userId,
        type: 'workout',
        action: `Novo plano de treino criado: ${workoutPlan.name}`,
        details: { workoutPlan: workoutPlan._id }
      });
      await activity.save();
    }
    
    // Return the newly created plan with client info populated
    const populatedWorkout = await WorkoutPlan.findById(workoutPlan._id)
      .populate('client', 'name email');
    
    res.status(201).json(populatedWorkout);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Erro ao criar plano de treino', error: error.message });
  }
});

// --- UPDATE A WORKOUT PLAN ---
// Updates the main details of a plan (name, description, difficulty, etc.).
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, difficulty, isActive, estimatedDuration } = req.body;
    
    const updatedPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, trainer: req.userId },
      { $set: { name, description, difficulty, isActive, estimatedDuration } },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).populate('client', 'name email');

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado ou sem permissão para editar.' });
    }
    
    res.json(updatedPlan);
  } catch (error) {
    console.error(`Error updating workout plan ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar o plano de treino', error: error.message });
  }
});

// --- DELETE A WORKOUT PLAN ---
// Removes a workout plan completely.
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedPlan = await WorkoutPlan.findOneAndDelete({ 
      _id: req.params.id, 
      trainer: req.userId 
    });

    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado ou sem permissão para deletar.' });
    }
    
    // Optionally, remove related activities (or handle this with a different strategy)
    // await Activity.deleteMany({ 'details.workoutPlan': req.params.id });

    res.json({ message: 'Plano de treino removido com sucesso.' });
  } catch (error) {
    console.error(`Error deleting workout plan ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao remover o plano de treino', error: error.message });
  }
});


// --- ADD AN EXERCISE TO A WORKOUT PLAN ---
// Pushes a new exercise object into the 'exercises' array of a specific plan.
router.post('/:id/exercises', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({ _id: req.params.id, trainer: req.userId });
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado.' });
    }

    // req.body should contain the new exercise object
    const newExercise = req.body;
    workoutPlan.exercises.push(newExercise);
    await workoutPlan.save();

    res.status(201).json(workoutPlan);
  } catch (error) {
    console.error(`Error adding exercise to plan ${req.params.id}:`, error);
    res.status(500).json({ message: 'Erro ao adicionar exercício', error: error.message });
  }
});

// --- UPDATE AN EXERCISE WITHIN A WORKOUT PLAN ---
// Finds a specific exercise in a plan and updates it.
router.put('/:id/exercises/:exerciseId', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOne({ _id: req.params.id, trainer: req.userId });
    if (!workoutPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado.' });
    }

    const exercise = workoutPlan.exercises.id(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercício não encontrado no plano.' });
    }

    // Update the exercise fields
    Object.assign(exercise, req.body);
    await workoutPlan.save();

    res.json(workoutPlan);
  } catch (error) {
    console.error(`Error updating exercise ${req.params.exerciseId}:`, error);
    res.status(500).json({ message: 'Erro ao atualizar exercício', error: error.message });
  }
});

// --- REMOVE AN EXERCISE FROM A WORKOUT PLAN ---
// Pulls a specific exercise from the 'exercises' array.
router.delete('/:id/exercises/:exerciseId', auth, async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, trainer: req.userId },
      { $pull: { exercises: { _id: req.params.exerciseId } } },
      { new: true }
    );

    if (!workoutPlan) {
      return res.status(404).json({ message: 'Plano de treino não encontrado.' });
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error(`Error removing exercise ${req.params.exerciseId}:`, error);
    res.status(500).json({ message: 'Erro ao remover exercício', error: error.message });
  }
});

module.exports = router;
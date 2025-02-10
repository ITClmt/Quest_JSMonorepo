// Some data to make the trick

// const programs = [
//   {
//     id: 1,
//     title: "The Good Place",
//     synopsis:
//       "À sa mort, Eleanor Shellstrop est envoyée au Bon Endroit, un paradis fantaisiste réservé aux individus exceptionnellement bienveillants. Or Eleanor n'est pas exactement une « bonne personne » et comprend vite qu'il y a eu erreur sur la personne. Avec l'aide de Chidi, sa prétendue âme sœur dans l'au-delà, la jeune femme est bien décidée à se redécouvrir.",
//     poster:
//       "https://img.betaseries.com/JwRqyGD3f9KvO_OlfIXHZUA3Ypw=/600x900/smart/https%3A%2F%2Fpictures.betaseries.com%2Ffonds%2Fposter%2F94857341d71c795c69b9e5b23c4bf3e7.jpg",
//     country: "USA",
//     year: 2016,
//   },
//   {
//     id: 2,
//     title: "Dark",
//     synopsis:
//       "Quatre familles affolées par la disparition d'un enfant cherchent des réponses et tombent sur un mystère impliquant trois générations qui finit de les déstabiliser.",
//     poster:
//       "https://img.betaseries.com/zDxfeFudy3HWjxa6J8QIED9iaVw=/600x900/smart/https%3A%2F%2Fpictures.betaseries.com%2Ffonds%2Fposter%2Fc47135385da176a87d0dd9177c5f6a41.jpg",
//     country: "Allemagne",
//     year: 2017,
//   },
// ];

// Declare the actions

import type { RequestHandler } from "express";
import programRepository from "./programRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const programsFromDB = await programRepository.readAll();

    const { q } = req.query;

    if (q != null) {
      const filteredPrograms = programsFromDB.filter((program) =>
        program.synopsis
          .toLowerCase()
          .includes(q.toString().toLowerCase() as string),
      );

      if (filteredPrograms.length === 0) {
        res.sendStatus(404);
      } else {
        res.json(filteredPrograms);
      }
    } else {
      res.json(programsFromDB);
    }
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const programsFromDB = await programRepository.readAll();
    const parsedId = Number.parseInt(req.params.id);

    const program = programsFromDB.find((p) => p.id === parsedId);

    if (program != null) {
      res.json(program);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const program = {
      id: req.body.id,
      title: req.body.title,
      synopsis: req.body.synopsis,
      poster: req.body.poster,
      country: req.body.country,
      year: req.body.year,
      category_id: req.body.category_id,
    };

    const affectedRows = await programRepository.update(program);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newProgram = {
      title: req.body.title,
      synopsis: req.body.synopsis,
      poster: req.body.poster,
      country: req.body.country,
      year: req.body.year,
      category_id: req.body.category_id,
    };

    const insertId = await programRepository.create(newProgram);

    res.status(201).json({ insertId });
  } catch (error) {
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const programId = Number.parseInt(req.params.id);

    await programRepository.delete(programId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const validate: RequestHandler = (req, res, next) => {
  type ValidationError = {
    field: string;
    message: string;
  };

  const errors: ValidationError[] = [];

  const { title, synopsis, poster, country, year, category_id } = req.body;

  // put your validation rules here
  if (title == null) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (title.length > 255) {
    errors.push({
      field: "title",
      message: "Title must be less than 255 characters",
    });
  }

  if (synopsis == null) {
    errors.push({ field: "synopsis", message: "Synopsis is required" });
  } else if (synopsis.length > 1000) {
    errors.push({
      field: "synopsis",
      message: "Synopsis must be less than 1000 characters",
    });
  }

  if (poster == null) {
    errors.push({ field: "poster", message: "Poster is required" });
  }

  if (country == null) {
    errors.push({ field: "country", message: "Country is required" });
  } else if (country.length > 255) {
    errors.push({
      field: "country",
      message: "Country must be less than 255 characters",
    });
  }

  if (year == null) {
    errors.push({ field: "year", message: "Year is required" });
  }

  if (category_id == null) {
    errors.push({ field: "category_id", message: "Category is required" });
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ validationErrors: errors });
  }
};

// Export them to import them somewhere else

export default { browse, read, edit, add, destroy, validate };

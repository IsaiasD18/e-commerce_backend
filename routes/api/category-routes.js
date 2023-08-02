const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
router.get('/', async (req, res) => {
  try {
    const catData = await Category.findAll({
      // be sure to include its associated Products
      include: [{
        model: Product
      }]
    });
    res.json(catData);

  } catch (error) {
    res.json({ message: error.message });
  }

});

// find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findByPk(req.params.id, {
      // be sure to include its associated Products
      include: [{
        model: Product
      }]
    });

    //Check id the id exists 
    if (!catData) {
      res.json('No category found with that id!')
      return;
    }

    res.json(catData);
  } catch (error) {
    res.json({ message: error.message });
  }

});

// create a new category
router.post('/', async (req, res) => {
  try {
    const catData = await Category.create({
      category_name: req.body.category_name
    })
    res.json(catData);

  } catch (error) {
    res.json({ message: error.message });
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const catData = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    //check if the id for the product exits
    if (!catData) {
      res.json('No product found with that id!')
      return;
    }

    res.json(catData);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });

     //check if the id for the product exits
     if (!catData) {
      res.json('No product found with that id!')
      return;
    }
    
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
